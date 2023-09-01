import type { RegisteredSite, User } from "@prisma/client";
import { prisma } from "$lib/server/prisma";
import sendRequest, { getOtherWebsiteKey } from "$lib/server/sendRequest";

type SiteAuthorizerProps = {
    websiteId: string
    user: User
    key: any
    redirectType: "link" | "json" | "indirect"
}

export default async function siteAuthorizer(data2: SiteAuthorizerProps): Promise<({ status: "nonregister" } | { status: "blacklist" } | { status: "success" } | { status: "link", link: URL } | { status: "json", json: any })> {
    const { user, websiteId, redirectType, key } = data2;
    console.log(`[server] Authorizing site: ${websiteId}`);
    let popularSites: any = {}
    if (user.popularSites === "") {
        popularSites[websiteId] = 1;
    } else {
        popularSites = JSON.parse(user.popularSites);
        popularSites[websiteId]= Object.keys(popularSites).includes(websiteId) ? popularSites[websiteId]+1 : 1;
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
        registeredSite = await prisma.registeredSite.findFirst({where: {unique: websiteId}});
    } catch (err) {
        console.log({registeredSiteLookupError: err});
        return {status: "nonregister"}
    }
    if (!registeredSite) return {status: "nonregister"}

    const url = registeredSite.url;
    if (redirectType === "link" || redirectType === "json") {
        const userData = await getOtherWebsiteKey(websiteId, user.id.toString(), registeredSite.id);
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
        if (userData === "blacklist") return { status: "blacklist" }
        if (userData === "nonregister") return { status: "blacklist" }

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

        console.log(`[server] Sending data to ${websiteId}`);
        if (redirectType==="link") {
            const newLocation = new URL(url);
            newLocation.searchParams.append("data", userData);
            newLocation.searchParams.append("key", key);
            newLocation.searchParams.append("name", user.name);
            newLocation.searchParams.append("email", user.email);
            newLocation.searchParams.append("username", user.userName);
            return {
                status: "link",
                link: newLocation
            }
        } else {
            return {
                status: "json",
                json: {
                    redirect: {
                        data: userData,
                        key,
                        name: user.name,
                        email: user.email,
                        username: user.userName,
                        where: url,
                        msg: "success"
                    }
                }
            }
        }
    }
    const requestSender = await sendRequest({
        websiteId,
        url,
        key,
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
        return { status: "blacklist" }
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
        return { status: "nonregister" }
    }
    console.log("Updating success logins");
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

    return { status: "success" }
}