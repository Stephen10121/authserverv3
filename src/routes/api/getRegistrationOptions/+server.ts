import { getUserFromDB, type Authenticator, type UserModel, setUserCurrentChallenge } from "$lib/server/twofactor";
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server';
import { error, fail } from "@sveltejs/kit";
import { verify } from "jsonwebtoken";

// Human-readable title for your website
const rpName = 'GruzAuth';
// A unique identifier for your website
const rpID = 'auth2.gruzservices.com';
// The URL at which registrations and authentications should occur
const origin = `https://${rpID}`;

export async function GET(event) {
    const refreshToken = event.cookies.get("G_VAR");

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
    // (Pseudocode) Retrieve any of the user's previously-
    // registered authenticators
    const userAuthenticators: Authenticator[] = user.devices;
    
    const options = generateRegistrationOptions({
        rpName,
        rpID,
        userID: user.id,
        userName: user.username,
        // Don't prompt users for additional information about the authenticator
        // (Recommended for smoother UX)
        attestationType: 'indirect',
        // Prevent users from re-registering existing authenticators
        excludeCredentials: userAuthenticators.map(authenticator => ({
        id: authenticator.credentialID,
        type: 'public-key',
        // Optional
        transports: authenticator.transports,
        })),
    });
    
    // (Pseudocode) Remember the challenge for this user
    if (!await setUserCurrentChallenge(user, options.challenge)) {
        throw error(400, "Error saving challenge.");
    }
    
    return new Response(JSON.stringify(options));
}