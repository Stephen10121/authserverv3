import { loginSchema, quickAuthSchema } from "$lib/schemas/schemas";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { message, setError, superValidate } from "sveltekit-superforms/server";
import type { User } from "@prisma/client";
import { compare } from "bcrypt";
import { createAccessToken, createRefreshToken } from "$lib/server/token";
import { dev } from "$app/environment";
import sendRequest from "$lib/server/sendRequest";
import { verify } from "jsonwebtoken";

export async function load(event) {
    const website = event.url.searchParams.get("website") as string;
    const key = event.url.searchParams.get("key") as string;

    if (!website && !key) throw redirect(307, "/");

    const form = await superValidate(event, loginSchema);
    const quickForm = await superValidate(event, quickAuthSchema);

    const refreshToken = event.cookies.get("G_VAR");

    let returnValues = { form, quickForm, website, key }

    if (!refreshToken) return returnValues

    let payload: { userId: number };
    try {
        payload = verify(refreshToken, import.meta.env.VITE_REFRESH_TOKEN_SECRET) as any as { userId: number };
    } catch (_err) {
        event.cookies.delete("G_VAR");
        return returnValues
    }

    if (!payload) return returnValues

    let user: User | null = null;
    try {
        user = await prisma.user.findFirst({
            where: {
                id: payload.userId
            }
        });
    } catch (err) {
        event.cookies.delete("G_VAR");
        return returnValues;
    }
    
    if (!user) {
        event.cookies.delete("G_VAR");
        return returnValues;
    }

    return {
        form,
        quickForm,
        website,
        key,
        accessToken: createAccessToken(payload.userId),
        name: user.name
    }
}

export const actions = {
    login: async (event) => {
        event.setHeaders({'Access-Control-Allow-Origin': `*`});
        const form = await superValidate(event, loginSchema);

        if (!form.valid) {
            return fail(400, { form });
        }
        let user: User | null = null;
        try {
            user = await prisma.user.findFirst({
                where: {
                    userName: form.data.username
                }
            });
        } catch (err) {
            return setError(form, 'overall', 'Invalid Login');
        }

        if (!user) return setError(form, 'overall', 'Invalid Login');

        // check password
        if (!await compare(form.data.password, user.password)) return setError(form, 'overall', 'Invalid Login');

        event.cookies.set("G_VAR", createRefreshToken(user.id), {
            path: "/",
            secure: !dev,
            maxAge: 990000000
        });
        
        if (user.tfa === "1") {
            const findKeys = await prisma.key.findMany({ where: { owner: user.id.toString() } })
            if (findKeys.length !== 0) {
                return message(form, 'tfa');
            }
        }

        console.log(`[server] Authorizing site: ${form.data.website}`);
        let popularSites: any = {}
        if (user.popularSites === "") {
            popularSites[form.data.website] = 1;
        } else {
            popularSites = JSON.parse(user.popularSites);
            popularSites[form.data.website]= Object.keys(popularSites).includes(form.data.website) ? popularSites[form.data.website]+1 : 1;
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                popularSites: JSON.stringify(popularSites)
            }
        });

        if (await sendRequest(form.data.website, form.data.key, user.userName, user.email, user.name) === "blacklist") {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    failedLogins: user.failedLogins + 1
                }
            });
            return message(form, 'blacklist');
        }
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                successLogins: user.successLogins + 1
            }
        });

        return message(form, 'success');
    },
    auth: async (event) => {
        event.setHeaders({'Access-Control-Allow-Origin': `*`});
        const form = await superValidate(event, quickAuthSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        let payload: { userId: number };
        try {
            payload = verify(form.data.accessToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET) as any as { userId: number };
        } catch (_err) {
            return setError(form, "overall", "Error logging in.");
        }

        if (!payload) return setError(form, "overall", "Error logging in.");

        let user: User | null = null;
        try {
            user = await prisma.user.findFirst({
                where: {
                    id: payload.userId
                }
            });
        } catch (err) {
            return setError(form, 'overall', 'Error logging in.');
        }

        if (!user) return setError(form, 'overall', 'Error logging in.');
        
        if (user.tfa === "1") {
            const findKeys = await prisma.key.findMany({ where: { owner: user.id.toString() } })
            if (findKeys.length !== 0) {
                return message(form, 'tfa');
            }
        }

        console.log(`[server] Authorizing site: ${form.data.website}`);
        let popularSites: any = {}
        if (user.popularSites === "") {
            popularSites[form.data.website] = 1;
        } else {
            popularSites = JSON.parse(user.popularSites);
            popularSites[form.data.website]= Object.keys(popularSites).includes(form.data.website) ? popularSites[form.data.website]+1 : 1;
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                popularSites: JSON.stringify(popularSites)
            }
        });

        if (await sendRequest(form.data.website, form.data.key, user.userName, user.email, user.name) === "blacklist") {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    failedLogins: user.failedLogins + 1
                }
            });
            return message(form, 'blacklist');
        }
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                successLogins: user.successLogins + 1
            }
        });

        return message(form, 'success');
    }
}