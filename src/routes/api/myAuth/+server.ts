import { json } from '@sveltejs/kit';
import { prisma } from "$lib/server/prisma";
import { createRefreshToken } from '$lib/server/token.js';

export async function POST(event) {
    const formData: {
        data: string;
        key: string;
        email: string;
        name: string;
        username: string;
    } = await event.request.json();
    
    if (!formData.data || !formData.key || !formData.email || !formData.name || !formData.username) {
        return json({ message: "missing" });
    }

    const siteArray = await prisma.sites.findMany({ where: { owner: formData.username } });
    const sites = siteArray.map((site) => { return { site: site.website, blackList: site.blacklist } });
    const user = await prisma.user.findFirst({ where: { userName: formData.username } });
    let success = 0;
    let failed = 0;
    let mostPopular;

    if (!user) {
        return json({ message: "nousername" });
    }

    if (user.successLogins) {
        success = user.successLogins;
    }
    if (user.failedLogins) {
        failed = user.failedLogins;
    }
    const sitesPopular = JSON.parse(user.popularSites);
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

    const keys: {
        id: number;
        owner: string;
        authenticator: number;
    }[] = await prisma.key.findMany({ where: { owner: user.id.toString() } }) as any;

    for (let i = 0; i < keys.length; i++) {
        let authenticator = await prisma.keysAuthenticator.findFirst({ where: { id: keys[i].authenticator } });
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
        userData: formData,
        sites,
        mostPopular,
        https: sites.filter(x => x.site.includes("https")).length,
        attemptedLogins: success + failed,
        failedLogins: failed,
        tfa: user.tfa,
        tfaKeys: keyDataArray
    }
    
    console.log("Send to client", { info: createRefreshToken(user.id) })
    //io.to(req.body.key).emit("login", info);

    return json({ message: "ok" });
}