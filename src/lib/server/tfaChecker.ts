import type { RegisteredSite, User } from "@prisma/client";
import { message } from "sveltekit-superforms/server";
import sendRequest, { getOtherWebsiteKey } from "./sendRequest";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import siteAuthorizer from "$lib/functions/siteAuthorizer";
/**
 * This checks if 2 factor authentication is available. If so, the user get notified, else the function returns a success message.
 */
export default async function tfaChecker(user: User, form: any) {
    console.log(`[server] Checking if user enabled 2fa.`);
    
    if (user.tfa === "1") {
        const findKeys = await prisma.key.findMany({ where: { owner: user.id.toString() } })
        if (findKeys.length !== 0) {
            console.log(`[server] User enabled 2fa.`);
            return message(form, 'tfa');
        }
    }

    const siteAuthorize = await siteAuthorizer({
        websiteId: form.data.websiteId,
        key: form.data.key,
        user,
        redirectType: form.data.type === "redirect" ? "link" : "indirect"
    });

    if (siteAuthorize.status === "blacklist") return message(form, 'blacklist');
    if (siteAuthorize.status === "nonregister") return message(form, 'nonregister');
    if (siteAuthorize.status === "success") return message(form, 'success');
    if (siteAuthorize.status === "link") throw redirect(307, siteAuthorize.link.href);
}