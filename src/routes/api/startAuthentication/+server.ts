import { getUserAuthenticator, getUserFromDB, saveUpdatedAuthenticatorCounter, type UserModel } from "$lib/server/twofactor";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { error, json, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { verify } from "jsonwebtoken";
import sendRequest, { getOtherWebsiteKey } from "$lib/server/sendRequest";

// Human-readable title for your website
const rpName = 'GruzAuth';
// A unique identifier for your website
const rpID = 'auth2.gruzservices.com';
// The URL at which registrations and authentications should occur
const origin = `https://${rpID}`;

export async function POST(event) {
    const refreshToken = event.cookies.get("G_VAR");
    const body = await event.request.json();

    if (!refreshToken) throw error(400, "No Token.");

    let payload2: { userId: number };
    try {
        payload2 = verify(refreshToken, import.meta.env.VITE_REFRESH_TOKEN_SECRET) as any as { userId: number };
    } catch (_err) {
        event.cookies.delete("G_VAR");
        throw error(400, "Invalid Token.");
    }

    if (!payload2) throw error(400, "Invalid token.");

    let user: UserModel | false = await getUserFromDB(payload2.userId);
    
    if (!user) {
        event.cookies.delete("G_VAR");
        throw error(400, "Invalid token.");
    }

    // (Pseudocode) Get `options.challenge` that was saved above
    const expectedChallenge = user.currentChallenge;
    if (!expectedChallenge) {
        throw error(400, "Cannot find user.");
    }
    // (Pseudocode} Retrieve an authenticator from the DB that
    // should match the `id` in the returned credential
    const authenticator = getUserAuthenticator(user, body.asseResp.id);

    if (!authenticator) {
        console.error(`Could not find authenticator ${body.asseResp.id} for user ${user.id}`);
        throw error(400, `Could not find authenticator ${body.asseResp.id} for user ${user.id}`);
    }

    let verification;
    try {
        console.log({
            credential: body.asseResp,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator
        })
        verification = await verifyAuthenticationResponse({
            response: body.asseResp,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
                ...authenticator,
                credentialID: Buffer.from(authenticator.credentialID),
                credentialPublicKey: Buffer.from(authenticator.credentialPublicKey)
            }
        });
    } catch (err) {
        console.error(err);
        throw error(400, "Internal error.");
    }
    
    const { verified } = verification;
    if (verified) {
        const { authenticationInfo } = verification;
        const { newCounter } = authenticationInfo;
        saveUpdatedAuthenticatorCounter(authenticator, newCounter);
    }
    
    const user2 = await prisma.user.findFirst({ where: { id: payload2.userId } });

    if (!user2) {
        event.cookies.delete("G_VAR");
        throw error(400, "Invalid cookie.");
    }

    console.log(`[server] Authorizing site: ${body.userData.website}`);
    let popularSites: any = {}
    if (user2.popularSites === "") {
        popularSites[body.userData.website] = 1;
    } else {
        popularSites = JSON.parse(user2.popularSites);
        popularSites[body.userData.website]= Object.keys(popularSites).includes(body.userData.website) ? popularSites[body.userData.website]+1 : 1;
    }

    await prisma.user.update({
        where: {
            id: user2.id
        },
        data: {
            popularSites: JSON.stringify(popularSites)
        }
    });
    if (body.userData.redirectTo) {
        const userData = await getOtherWebsiteKey(body.userData.website, user2.userName);
        if (userData === "false") {
            await prisma.user.update({
                where: {
                    id: user2.id
                },
                data: {
                    failedLogins: user2.failedLogins + 1
                }
            });
            throw error(400, 'blacklist');
        }
        await prisma.user.update({
            where: {
                id: user2.id
            },
            data: {
                successLogins: user2.successLogins + 1
            }
        });

        return json({ redirect: {
            data: userData,
            key: body.userData.key,
            name: user2.name,
            email: user2.email,
            username: user2.userName,
            where: body.userData.redirectTo,
            msg: "success"
        } });
    } else if (await sendRequest(body.userData.website, body.userData.key, user2.name, user2.email, user2.userName) === "blacklist") {
        await prisma.user.update({
            where: {
                id: user2.id
            },
            data: {
                failedLogins: user2.failedLogins + 1
            }
        });
        throw error(400, 'blacklist');
    }
    console.log("Sucess login");
    await prisma.user.update({
        where: {
            id: user2.id
        },
        data: {
            successLogins: user2.successLogins + 1
        }
    });

    return new Response(JSON.stringify({msg: 'success'}));
}