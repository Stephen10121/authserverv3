import verifyToken from "$lib/functions/verifyToken";
import { getUserFromDB, type UserModel } from "$lib/server/twofactor";
import { error, json } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export async function POST(event) {
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

    try {
        await prisma.user.update({ where: { id: parseInt(user.id) }, data: { tfa: "0" } });
    } catch (err) {
        console.error(err);
        throw error(500, "Internal Error.");
    }
    
    return json({
        error: false
    });
}