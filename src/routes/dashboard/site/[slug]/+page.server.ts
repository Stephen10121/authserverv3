import type { MyUser, RegisteredSite, Sites, User } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { verify } from 'jsonwebtoken';

export async function load(event) {
    if (!event.params.slug) throw redirect(307, "/dashboard");
    const data = await event.parent();

    let payload: { userId: number };
    try {
        payload = verify(data.accessToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET) as any as { userId: number };
        if (!payload) throw redirect(307, "/");
    } catch (_err) {
        throw redirect(307, "/");
    }

    let user: MyUser | null
    try {
        user = await prisma.myUser.findFirst({
            where: {
                id: payload.userId
            }
        });
        if (!user) throw redirect(307, "/");
    } catch(err) {
        throw redirect(307, "/");
    }

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

    let mySite: Sites | null
    try {
        mySite = await prisma.sites.findFirst({
            where: {
                owner: user.id.toString(),
                website: event.params.slug
            }
        });
        if (!mySite) throw redirect(307, "/");
    } catch(err) {
        throw redirect(307, "/");
    }

    let registeredSite: RegisteredSite | null
    try {
        registeredSite = await prisma.registeredSite.findFirst({
            where: {
                unique: event.params.slug
            }
        });
        if (!registeredSite) throw redirect(307, "/");
    } catch(err) {
        throw redirect(307, "/");
    }

    return {
        siteData: {
            owner: registeredSite.owner === actuallUser.id,
            logins: mySite.logins,
            blacklist: mySite.blacklist,
            name: mySite.name,
            uniqueName: mySite.website,
            loginHistory: mySite.loginHistory
        }
    }
}