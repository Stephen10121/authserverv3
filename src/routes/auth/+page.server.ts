import { setError, superValidate } from "sveltekit-superforms/server";
import { createAccessToken, createRefreshToken } from "$lib/server/token";
import { loginSchema, quickAuthSchema } from "$lib/schemas/schemas";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import type { RegisteredSite, User } from "@prisma/client";
import { dev } from "$app/environment";
import { verify } from "jsonwebtoken";
import { compare } from "bcrypt";
import tfaChecker from "$lib/server/tfaChecker.js";

export async function load(event) {
    const website = event.url.searchParams.get("websiteId") as string;
    const key = event.url.searchParams.get("key") as string;
    const type = event.url.searchParams.get("type") as "redirect" | "rest";

    if (!website || !key || !type) throw redirect(307, "/");

    let websiteGetter: RegisteredSite | null;
    try {
        websiteGetter = await prisma.registeredSite.findFirst({ where: { unique: website } });
    } catch (err) {
        console.error(err);
        throw redirect(307, "/");
    }

    if (!websiteGetter) throw redirect(307, "/");

    const [form, quickForm] = await Promise.all([await superValidate(event, loginSchema), await superValidate(event, quickAuthSchema)]);

    let defaultReturnValues = { form, quickForm, website, key }

    const refreshToken = event.cookies.get("G_VAR");
    if (!refreshToken) return defaultReturnValues



    let payload: { userId: number };
    try {
        payload = verify(refreshToken, import.meta.env.VITE_REFRESH_TOKEN_SECRET) as any as { userId: number };
    } catch (_err) {
        event.cookies.delete("G_VAR");
        return defaultReturnValues
    }

    if (!payload) return defaultReturnValues

    let user: User | null = null;
    try {
        user = await prisma.user.findFirst({
            where: {
                id: payload.userId
            }
        });
    } catch (err) {
        event.cookies.delete("G_VAR");
        return defaultReturnValues;
    }
    
    if (!user) {
        event.cookies.delete("G_VAR");
        return defaultReturnValues;
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
        
        return tfaChecker(user, form);
    },
    auth: async (event) => {
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

        return tfaChecker(user, form);
    }
}