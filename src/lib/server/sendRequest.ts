import type { Sites } from "@prisma/client";
import { createHash } from "crypto";

export const hashed = (password: string) => {
    const hash = createHash('sha256').update(password).digest("hex");
    return hash;
}

async function addSite(owner: string, website: string) {
    try {
        await prisma.sites.create({
            data: {
                owner,
                website,
                hash: hashed(hashed(owner)+hashed(website)),
                blacklist: "false"
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

async function getOtherWebsiteKey(website: string, owner: string) {
    let userSites = await getSites(owner, website);

    if (!userSites) {
        await addSite(owner, website);
        userSites = await getSites(owner, website) as any;
    }

    const sites = userSites as Sites;
    
    if (sites.blacklist === "false") {
        return sites.hash;
    };
    return "false";
}

export default async function sendRequest(website: string, key: string, name: string, email: string, username: string) {
    const userData = await getOtherWebsiteKey(website, username);
    if (userData === "false") {
        return "blacklist";
    }
    console.log(`[server] Sending data to ${website}`);
    try {
        const request = await fetch(website, {
            method: "POST",
            body: JSON.stringify({ data: userData, key, name, email, username }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        await request.json();
        console.log(`[server] Status code from ${website}: ${request.status}`);
    } catch (err) {
        console.log(`[server] Error when sending data to ${website}`);
    }
}