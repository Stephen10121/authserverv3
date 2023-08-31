import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function startup() {
    const data = await hash("passwordHere", 10);
    const user = await prisma.user.create({
        data: {
            userName: "stephen",
            name: "Stephen Gruzin",
            email: "me@stephengruzin.dev",
            phone: "",
            password: data,
            tfa: "0",
            successLogins: 0,
            failedLogins: 0,
            popularSites: "",
            currentChallenge: "",
            tokenVersion: 0,
        }
    });
    if (!user) {
        console.log("No user created.");
    }
    await prisma.registeredSite.create({
        data: {
            logins: 0,
            url: "https://testauth.stephengruzin.dev/myAuth",
            name: "GruzAuth",
            unique: "gruzauth",
            owner: user.id,
            themes: JSON.stringify(["system", "light", "dark"])
        }
    });
    await prisma.registeredSite.create({
        data: {
            logins: 0,
            url: "http://192.168.0.24:5173/myAuth",
            name: "GruzAuth Beta",
            unique: "gruzauth2",
            owner: user.id,
            themes: JSON.stringify(["system", "light", "dark"])
        }
    });
}

startup();