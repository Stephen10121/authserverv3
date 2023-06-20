import type { RegisteredSite, User } from "@prisma/client";
import { message } from "sveltekit-superforms/server";
import sendRequest, { getOtherWebsiteKey } from "./sendRequest";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
/**
 * This checks if 2 factor authentication is available. If so, the user get notified, else the function returns a success message.
 */
export default async function tfaChecker(user: User, form: any) {
    if (user.tfa === "1") {
        const findKeys = await prisma.key.findMany({ where: { owner: user.id.toString() } })
        if (findKeys.length !== 0) {
            return message(form, 'tfa');
        }
    }

    console.log(`[server] Authorizing site: ${form.data.websiteId}`);
    let popularSites: any = {}
    if (user.popularSites === "") {
        popularSites[form.data.websiteId] = 1;
    } else {
        popularSites = JSON.parse(user.popularSites);
        popularSites[form.data.websiteId]= Object.keys(popularSites).includes(form.data.websiteId) ? popularSites[form.data.websiteId]+1 : 1;
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            popularSites: JSON.stringify(popularSites)
        }
    });

    let registeredSite: RegisteredSite | null = null;
    try {
        registeredSite = await prisma.registeredSite.findFirst({where: {unique: form.data.websiteId}});
    } catch (err) {
        console.log(err);
        return "nonregister";
    }
    if (!registeredSite) {
        return "nonregister";
    }
    const url = registeredSite.url;

    if (form.data.type === "redirect") {
        const userData = await getOtherWebsiteKey(form.data.websiteId, user.id.toString(), registeredSite.id);
        if (userData === "blacklist" || userData==="nonregister") {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    failedLogins: {
                        increment: 1
                    }
                }
            });
        }
        if (userData === "blacklist") return message(form, 'blacklist');
        if (userData === "nonregister") return message(form, 'nonregister');

        console.log(`[server] Sending data to ${form.data.websiteId}`);
        const newLocation = new URL(url);
        newLocation.searchParams.append("data", userData);
        newLocation.searchParams.append("key", form.data.key);
        newLocation.searchParams.append("name", user.name);
        newLocation.searchParams.append("email", user.email);
        newLocation.searchParams.append("username", user.userName);
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                successLogins: {
                    increment: 1
                }
            }
        });
        throw redirect(307, newLocation.href);
    }
    const requestSender = await sendRequest({
        websiteId: form.data.websiteId,
        url,
        key: form.data.key,
        username: user.userName,
        email: user.email,
        name: user.name,
        siteId: registeredSite.id,
        userId: user.id.toString()
    });
    if (requestSender === "blacklist") {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                failedLogins: {
                    increment: 1
                }
            }
        });
        return message(form, 'blacklist');
    }
    if (requestSender === "nonregister") {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                failedLogins: {
                    increment: 1
                }
            }
        });
        return message(form, 'nonregister');
    }
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            successLogins: {
                increment: 1
            }
        }
    });

    return message(form, 'success');
}