import { dev } from "$app/environment";
import myUserCreate from "$lib/functions/myUserCreate.js";
import myUserFind from "$lib/functions/myUserFind";
import { createRefreshToken } from "$lib/server/token";
import type { MyUser } from "@prisma/client";
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

    let userLookupRes = await myUserFind({
        method: "hash",
        hash: data
    });
    let userLookup: MyUser;

    if (userLookupRes.error) {
        let userCreate = await myUserCreate({name, username, hash: data, email});
        if (userCreate.error) return { status: "error" }
        userLookup = userCreate.user;
    } else {
        userLookup = userLookupRes.user;
    }
    
    event.cookies.set("G_PERS", createRefreshToken(userLookup.id), {
        path: "/",
        secure: !dev,
        maxAge: 990000000
    });
    
    throw redirect(307, "/dashboard");
}