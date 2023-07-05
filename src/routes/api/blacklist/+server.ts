import { error } from "@sveltejs/kit";
import { verify } from "jsonwebtoken";
import { prisma } from "$lib/server/prisma";

export async function POST({ request, cookies }) {
    const body = await request.json();
    
    if (!body.name || !body.token) {
        throw error(400, "Missing arguments.");
    }

    let payload: { userId: number };
    try {
        payload = verify(body.token, import.meta.env.VITE_ACCESS_TOKEN_SECRET) as any as { userId: number };
    } catch (_err) {
        cookies.delete("G_VAR");
        throw error(400, "Invalid Token.");
    }

    const user = await prisma.user.findFirst({ where: { id: payload.userId } });
    if (!user) {
        throw error(400, "Invalid Token.");
    }

    if (body.name === "gruzauth2" || body.name === "gruzauth") {
        throw error(400, "Failed.");
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