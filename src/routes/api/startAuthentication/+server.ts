import { getUserAuthenticator, getUserFromDB, saveUpdatedAuthenticatorCounter, type UserModel } from "$lib/server/twofactor";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { error, json, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { verify } from "jsonwebtoken";
import sendRequest, { getOtherWebsiteKey } from "$lib/server/sendRequest";
import type { RegisteredSite } from "@prisma/client";

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

    let registeredSite: RegisteredSite | null = null;
    try {
        registeredSite = await prisma.registeredSite.findFirst({where: {unique: body.userData.website}});
    } catch (err) {
        console.log(err);
        throw error(400, 'nonregister');
    }
    if (!registeredSite) {
        throw error(400, 'nonregister');
    }
    const url = registeredSite.url;

    if (body.userData.type === "redirect") {
        const userData = await getOtherWebsiteKey(body.userData.website, user.id.toString(), registeredSite.id);
        
        if (userData === "blacklist" || userData==="nonregister") {
            await prisma.user.update({
                where: {
                    id: user2.id
                },
                data: {
                    failedLogins: user2.failedLogins + 1
                }
            });
        }
        if (userData === "blacklist") throw error(400, 'blacklist');
        if (userData === "nonregister") throw error(400, 'nonregister');

        await prisma.user.update({
            where: {
                id: user2.id
            },
            data: {
                successLogins: user2.successLogins + 1
            }
        });
        console.log(`[server] Sending data to ${body.userData.website} after tfa`);
        return json({ redirect: {
            data: userData,
            key: body.userData.key,
            name: user2.name,
            email: user2.email,
            username: user2.userName,
            where: url,
            msg: "success"
        }});

    }
    const requestSender = await sendRequest({
        websiteId: body.userData.website,
        url,
        key: body.userData.key,
        username: user2.userName,
        email: user2.email,
        name: user2.name,
        siteId: registeredSite.id,
        userId: user.id.toString()
    });
    if (requestSender === "blacklist") {
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
    if (requestSender === "nonregister") {
        await prisma.user.update({
            where: {
                id: user2.id
            },
            data: {
                failedLogins: user2.failedLogins + 1
            }
        });
        throw error(400, 'nonregister');
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