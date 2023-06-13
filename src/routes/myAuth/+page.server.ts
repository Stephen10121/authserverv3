import { dev } from "$app/environment";
import { prisma } from "$lib/server/prisma";
import { createRefreshToken } from "$lib/server/token";
import type { Key, MyUser } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export async function load(event) {
    const data = event.url.searchParams.get("data") as string;
    const key = event.url.searchParams.get("key") as string;
    const name = event.url.searchParams.get("name") as string;
    const email = event.url.searchParams.get("email") as string;
    const username = event.url.searchParams.get("username") as string;

    if (!username || !data || !key || !name || !email) {
        return { status: "error" }
    }

    let userLookup: MyUser | null = null;
    try {
        userLookup = await prisma.myUser.findFirst({ where: { hash: data } });
    } catch (err) {
        console.log({userFindError: err});
        return { status: "error" }
    }

    if (!userLookup) {
        try {
            userLookup = await prisma.myUser.create({
                data: {
                    name,
                    username,
                    hash: data,
                    email
                }
            });
        } catch (err) {
            return { status: "error" }
        }
    }
    
    event.cookies.set("G_PERS", createRefreshToken(userLookup.id), {
        path: "/",
        secure: !dev,
        maxAge: 990000000
    });
    
    throw redirect(307, "/dashboard");
}