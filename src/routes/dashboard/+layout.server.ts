import { createAccessToken } from '$lib/server/token.js';
import type { Key, MyUser, RegisteredSite, Sites, User } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { verify } from "jsonwebtoken";
import { dev } from '$app/environment';
import { prisma } from "$lib/server/prisma";
import myUserFind from '$lib/functions/myUserFind';

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

    let userLookup = await myUserFind({ method: "id", id: payload.userId });
    if (userLookup.error) {
        cookies.delete("G_PERS");
        throw redirect(307, "/");
    }
    let user = userLookup.user;

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
    let sites: { site: string; blackList: string; name: string; https: boolean }[] = [];
    for (let i=0;i<siteArray.length;i++) { 
        let registeredSite = await prisma.registeredSite.findFirst({ where: { unique: siteArray[i].website }});
        if (!registeredSite) continue;
        sites.push({ site: siteArray[i].website, blackList: siteArray[i].blacklist, name: siteArray[i].name, https: registeredSite.url.includes("https://") })
    }
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
    const mostpopularsite = await prisma.registeredSite.findFirst({ where: { unique: mostPopular }});
    const newMostPopular = {
        id: mostPopular,
        name: mostpopularsite ? mostpopularsite.name : mostPopular
    }
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
        mostPopular: newMostPopular,
        https: sites.filter(x => x.https).length,
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