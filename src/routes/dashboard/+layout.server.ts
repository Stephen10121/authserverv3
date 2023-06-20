import { createAccessToken } from '$lib/server/token.js';
import type { Key, MyUser, Sites, User } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { verify } from "jsonwebtoken";
import { dev } from '$app/environment';
import { prisma } from "$lib/server/prisma";

export async function load({ cookies }) {
    const refreshToken = cookies.get("G_PERS");
    let theme = cookies.get("theme");
    
    if (!theme) {
        cookies.set("theme", "system", {path: "/", secure: !dev, expires: new Date(2.04e12)});
        theme = "system"
    }

    if (!refreshToken) throw redirect(307, "/");

    let payload: { userId: number };
    try {
        payload = verify(refreshToken, import.meta.env.VITE_REFRESH_TOKEN_SECRET) as any as { userId: number };
    } catch (_err) {
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }

    if (!payload) {
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }

    let user: MyUser | null = null;
    try {
        user = await prisma.myUser.findFirst({ where: { id: payload.userId } });
    } catch (err) {
        console.log({userGetError: err});
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }

    if (!user) {
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }

    let superUser: User | null = null;
    try {
        superUser = await prisma.user.findFirst({ where: { email: user.email } });
    } catch (err) {
        console.log({getSuperUserError: err});
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }

    if (!superUser) {
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }

    let siteArray: Sites[] = [];
    try {
        siteArray = await prisma.sites.findMany({ where: { owner: superUser.id.toString() } });
    } catch (err) {
        console.log({siteArrayLookupError: err});
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }

    const sites = siteArray.map((site) => {
        return { site: site.website, blackList: site.blacklist, name: site.name };
    });
    let success = 0;
    let failed = 0;
    let mostPopular;

    if (superUser.successLogins) {
        success = superUser.successLogins;
    }
    if (superUser.failedLogins) {
        failed = superUser.failedLogins;
    }
    const sitesPopular = JSON.parse(superUser.popularSites);
    const siteKeys = Object.keys(sitesPopular);
    let currentPop = {
        val: 0,
        key: ""
    }
    for (let i = 0; i < siteKeys.length; i++) {
        let value = sitesPopular[siteKeys[i]];
        if (value > currentPop.val) {
            currentPop.val = value;
            currentPop.key = siteKeys[i];
        }
    }
    mostPopular = currentPop.key;
    let keyDataArray = [];
    const keys = await prisma.key.findMany({ where: { owner: user.id.toString() } }) as any as Key[];
    for (let i = 0; i < keys.length; i++) {
        let authenticator = await prisma.keysAuthenticator.findFirst({ where: { id: keys[i].authenticator} });
        if (!authenticator) {
            continue
        }
        let keyData = {
            id: keys[i].id,
            name: authenticator.name
        }
        keyDataArray.push(keyData);
    }
    const info = {
        userData: {
            user: user.name,
            username: user.username
        },
        sites,
        mostPopular,
        https: sites.filter(x => x.site.includes("https")).length,
        attemptedLogins: success + failed,
        failedLogins: failed,
        tfa: superUser.tfa,
        tfaKeys: keyDataArray
    }
    
    return {
        accessToken: createAccessToken(payload.userId),
        info,
        theme
    }
}