import verifyToken from "$lib/functions/verifyToken.js";
import { getUserFromDB, type Authenticator, type UserModel, setUserCurrentChallenge } from "$lib/server/twofactor";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { error } from "@sveltejs/kit";
import { verify } from "jsonwebtoken";

export async function GET(event) {
    const refreshToken = event.cookies.get("G_VAR");

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
    // (Pseudocode) Retrieve any of the user's previously-
    // registered authenticators
    const userAuthenticators: Authenticator[] = user.devices;
    
    const options = generateAuthenticationOptions({
        // Require users to use a previously-registered authenticator
        allowCredentials: userAuthenticators.map(authenticator => ({
            id: authenticator.credentialID,
            type: 'public-key',
            // Optional
            transports: authenticator.transports,
        })),
        userVerification: 'preferred',
    });
    
    // (Pseudocode) Remember this challenge for this user
    if (!await setUserCurrentChallenge(user, options.challenge)) {
        throw error(400, "Error Saving Challenge.");
    }

    return new Response(JSON.stringify(options));
}