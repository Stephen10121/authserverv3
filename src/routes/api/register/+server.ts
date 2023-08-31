import { dev } from '$app/environment';
import verifyToken from '$lib/functions/verifyToken';
import { getUserCurrentChallenge, getUserFromDB, type Authenticator, type UserModel, addNewDevice } from '$lib/server/twofactor';
import { verifyRegistrationResponse, type VerifiedRegistrationResponse } from '@simplewebauthn/server';
import { error } from '@sveltejs/kit';

// Human-readable title for your website
const rpName = 'GruzAuth';
// A unique identifier for your website
let rpID = 'auth.stephengruzin.dev';
if (dev) {
    rpID = "testauth.stephengruzin.dev";
}
// The URL at which registrations and authentications should occur
const origin = `https://${rpID}`;

export async function POST({ request, cookies }) {
    const body = await request.json();

    if (!body.keyName) {
        throw error(400, "No key name.");
    }
    
    const refreshToken = cookies.get("G_VAR");

    if (!refreshToken) throw error(400, "No Token.");

    let tokenVerification = verifyToken({
        tokenType: "refresh",
        token: refreshToken
    });
    if (tokenVerification.error) throw error(400, "Invalid Token.");
    let payload2 = tokenVerification.payload;

    let user: UserModel | false = await getUserFromDB(payload2.userId);
    
    if (!user) {
        cookies.delete("G_VAR");
        throw error(400, "Invalid token.");
    }
    // (Pseudocode) Get `options.challenge` that was saved above
    const expectedChallenge = await getUserCurrentChallenge(user);

    if (!expectedChallenge) {
        throw error(400, "Error finding user.");
    }
    
    let verification: VerifiedRegistrationResponse | null = null;
    let errorverification = false;
    try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
    } catch (error) {
        console.error(error);
        errorverification = true;
    }

    if (errorverification) {
        throw error(400, "Internal error.");
    }

    if (!verification) {
        throw error(400, "Internal error.");
    }
    
    const { verified, registrationInfo } = verification;
    
    if (verified && registrationInfo) {
        const { credentialPublicKey, credentialID, counter } = registrationInfo;
    
        const existingDevice = user.devices.find(device => device.credentialID===credentialID);
    
        if (!existingDevice) {
        /**
         * Add the returned device to the user's list of devices
         */
        const newDevice: Authenticator = {
            id: 1,
            credentialPublicKey: JSON.parse("["+credentialPublicKey.toString()+"]"),
            credentialID: JSON.parse("["+ credentialID.toString()+"]"),
            counter,
            transports: body.transports,
            owner: user.id,
            blacklist: false,
            name: body.keyName
        };
        const resp = await addNewDevice(newDevice);
        if (!resp) {
            throw error(400, "Cannot save key.");
        }
        }
    }
    return new Response(JSON.stringify(verified));
}