import myUserFind from '$lib/functions/myUserFind';
import verifyToken from '$lib/functions/verifyToken';
import type { User, Sites, RegisteredSite } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { prisma } from "$lib/server/prisma";

export async function load(event) {
    if (!event.params.slug) throw redirect(307, "/dashboard");
    const data = await event.parent();

    let tokenVerification = verifyToken({
        tokenType: "access",
        token: data.accessToken
    });
    if (tokenVerification.error) throw redirect(307, "/");
    let payload = tokenVerification.payload;

    let user2 = await prisma.myUser.findFirst({ where: { id: payload.userId } });
    if (!user2) throw redirect(307, "/");

    let user = await prisma.user.findFirst({ where: { userName: user2.username } });
    if (!user) throw redirect(307, "/");
    // let userLookup = await myUserFind({ method: "id", id: payload.userId });
    // if (userLookup.error) throw redirect(307, "/");
    // let user = userLookup.user;

    let actuallUser: User | null
    try {
        actuallUser = await prisma.user.findFirst({
            where: {
                id: user.id
            }
        });
        if (!actuallUser) throw redirect(307, "/");
    } catch(err) {
        throw redirect(307, "/");
    }
    console.log("Getting my site.")
    console.table({id: user.id, name: user.userName});
    let mySite: Sites | null
    try {
        console.log({owner: user.id, website: event.params.slug})
        mySite = await prisma.sites.findFirst({
            where: {
                owner: user.id.toString(),
                website: event.params.slug
            }
        });
        console.log({mySite})
        if (!mySite) throw redirect(307, "/");
    } catch(err) {
        throw redirect(307, "/");
    }
    console.log("Getting Registered Site.")
    let registeredSite: RegisteredSite | null
    try {
        registeredSite = await prisma.registeredSite.findFirst({
            where: {
                unique: event.params.slug
            }
        });
        console.log({registeredSite});
        if (!registeredSite) throw redirect(307, "/");
    } catch(err) {
        console.log({err})
        throw redirect(307, "/");
    }
    console.log({registeredSite})

    return {
        siteData: {
            owner: registeredSite.owner === actuallUser.id,
            logins: mySite.logins,
            blacklist: mySite.blacklist,
            name: mySite.name,
            uniqueName: mySite.website,
            loginHistory: mySite.loginHistory,
            secure: registeredSite.url.includes("https://"),
            ownerName: actuallUser.name,
            ownerEmail: actuallUser.email,
            currentTheme: mySite.theme,
            themeOptions: registeredSite.themes
        }
    }
}