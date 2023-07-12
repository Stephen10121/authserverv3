import { error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import verifyToken from "$lib/functions/verifyToken";

export async function POST({ request, cookies }) {
    const body = await request.json();
    
    if (!body.name || !body.token) {
        throw error(400, "Missing arguments.");
    }

    let tokenVerification = verifyToken({
        tokenType: "access",
        token: body.token
    });
    if (tokenVerification.error) {
        cookies.delete("G_VAR");
        throw error(400, "Invalid Token.");
    }
    let payload = tokenVerification.payload;

    const user = await prisma.user.findFirst({ where: { id: payload.userId } });
    if (!user) {
        throw error(400, "Invalid Token.");
    }

    if (body.name === "gruzauth2" || body.name === "gruzauth") {
        throw error(400, "You can't blacklist this subscription.");
    }

    const site = await prisma.sites.findFirst({ where: { website: body.name, owner: user.id.toString() } });
    
    if (!site) {
        throw error(400, "Failed.");
    }

    try {
        await prisma.sites.update({
            where: {
                id: site.id
            },
            data: {
                blacklist: body.blacklist ? "true" : "false"
            }
        });
    } catch (err) {
        console.log({blacklistsiteerror: err});
        throw error(400, "Failed.");
    }

    return new Response("ok");
}