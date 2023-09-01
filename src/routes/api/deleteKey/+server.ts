import verifyToken from "$lib/functions/verifyToken";
import { getUserFromDB, type UserModel } from "$lib/server/twofactor";
import { error, json } from "@sveltejs/kit";
import type { Key } from '@prisma/client';
import { prisma } from "$lib/server/prisma";

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
    if (!body.name || !body.id) {
        throw error(400, "Missing parameters.");
    }
    console.log({ owner: user.id, id: body.id })
    const gotKey = await prisma.key.findFirst({ where: { owner: user.id, id: body.id } }) as Key | null;
    if (!gotKey) throw error(400, "No key found.");

    const gotKeyAuthenticator = await prisma.keysAuthenticator.findFirst({ where: { id: gotKey.authenticator, name: body.name } });
    if (!gotKeyAuthenticator) throw error(400, "No key found.");

    console.log({gotKey, gotKeyAuthenticator})

    try {
        await prisma.keysAuthenticator.delete({ where: { id: gotKey.authenticator } });
        await prisma.key.delete({ where: { id: gotKey.id }});
    } catch (err) {
        console.error(err);
        throw error(400, "Internal error.");
    }
    return json({ error: false });
}