import { getUserAuthenticator, getUserFromDB, saveUpdatedAuthenticatorCounter, type UserModel } from "$lib/server/twofactor";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { error, json, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { verify } from "jsonwebtoken";
import sendRequest, { getOtherWebsiteKey } from "$lib/server/sendRequest";
import type { RegisteredSite } from "@prisma/client";
import verifyToken from "$lib/functions/verifyToken";
import siteAuthorizer from "$lib/functions/siteAuthorizer.js";

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

    let tokenVerification = verifyToken({
        tokenType: "refresh",
        token: refreshToken
    });
    if (tokenVerification.error) throw error(400, "Invalid Token.");
    let payload2 = tokenVerification.payload;

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

    const siteAuthorize = await siteAuthorizer({
        websiteId: body.userData.website,
        key: body.userData.key,
        user: user2,
        redirectType: body.userData.type === "redirect" ? "json" : "indirect"
    });

    if (siteAuthorize.status === "blacklist") throw error(400, 'blacklist');
    if (siteAuthorize.status === "nonregister") throw error(400, 'nonregister');
    if (siteAuthorize.status === "success") return new Response(JSON.stringify({msg: 'success'}));
    if (siteAuthorize.status === "json") return json(siteAuthorize.json);
    if (siteAuthorize.status === "link") throw redirect(307, siteAuthorize.link.href);
}