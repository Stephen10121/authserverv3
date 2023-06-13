import type { Sites } from "@prisma/client";
import { createHash } from "crypto";

export const hashed = (password: string) => {
    const hash = createHash('sha256').update(password).digest("hex");
    return hash;
}

async function addSite(owner: string, website: string, siteId: number) {
    try {
        await prisma.sites.create({
            data: {
                owner,
                website,
                hash: hashed(hashed(owner)+hashed(website)+hashed(siteId.toString())),
                blacklist: "false",
                logins: 0
            }
        });
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}

async function getSites(owner: string, website: string) {
    try {
        const sites = await prisma.sites.findFirst({
            where: {
                owner,
                website
            }
        });
        if (!sites) return false;
        return sites;
    } catch (err) {
        return false;
    }
}

export async function getOtherWebsiteKey(website: string, owner: string, siteId: number) {
    let userSites = await getSites(owner, website);

    if (!userSites) {
        await addSite(owner, website, siteId);
        userSites = await getSites(owner, website);
    }

    const sites = userSites as Sites;
    
    if (sites.blacklist === "false") {
        await prisma.sites.update({
            where: {
                id: sites.id
            },
            data: {
                logins: sites.logins + 1
            }
        });
        
        await prisma.registeredSite.update({
            where: {
                unique: website
            },
            data: {
                logins: {
                    increment: 1
                }
            }
        });
        return sites.hash;
    };
    return "false";
}

interface SendRequestData {
    websiteId: string;
    url: string;
    key: string;
    name: string;
    email: string;
    username: string;
    siteId: number;
    userId: string;
}

export default async function sendRequest({websiteId, url, key, name, email, username, siteId, userId}: SendRequestData) {
    const userData = await getOtherWebsiteKey(websiteId, userId, siteId);
    
    if (userData === "false") {
        return "blacklist";
    }
    console.log(`[server] Sending data to ${websiteId}`);
    try {
        const request = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ data: userData, key, name, email, username }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        await request.json();
        console.log(`[server] Status code from ${url}: ${request.status}`);
    } catch (err) {
        console.log(err);
        console.log(`[server] Error when sending data to ${url}`);
    }
}