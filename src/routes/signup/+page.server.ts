import { signupSchema } from "$lib/schemas/schemas";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma.js";
import { hash } from "bcrypt";
import { message, setError, superValidate } from "sveltekit-superforms/server";
import { dev } from "$app/environment";
import { createRefreshToken } from "$lib/server/token.js";

export async function load(event) {
    const form = await superValidate(event, signupSchema);

    return { form }
}

export const actions = {
    default: async (event) => {
        event.setHeaders({'Access-Control-Allow-Origin': `*`});
        const form = await superValidate(event, signupSchema);


        if (!form.valid) return fail(400, { form });
        if (form.data.password !== form.data.passwordRepeat) return setError(form, "passwordRepeat", "Passwords don't match.");

        try {
            if (await prisma.user.findFirst({ where: { userName: form.data.username }}) !== null) return setError(form, "username", "Username already exists.");
        } catch (err) {
            return setError(form, "username", "Username already exists.");
        }
        
        try {
            const data = await hash(form.data.password, 10);
            const user = await prisma.user.create({
                data: {
                    userName: form.data.username,
                    name: form.data.name,
                    email: form.data.email,
                    phone: "",
                    password: data,
                    tfa: form.data.tfa ? "1" : "0",
                    successLogins: 0,
                    failedLogins: 0,
                    popularSites: "",
                    currentChallenge: "",
                    tokenVersion: 0
                }
            })
            if (!user) {
                return setError(form, 'overall', "Cannot create user.");
            }

            event.cookies.set("G_VAR", createRefreshToken(user.id), {
                path: "/",
                secure: !dev,
                maxAge: 990000000
            });
        } catch (err) {
            console.error({signupHashFunctionError: err});
            return setError(form, 'overall', "Cannot create user.");
        }

        // return setError(form, 'overall', 'Invalid Login');
        if (form.data.tfa) return message(form, 'tfa');

        const redirectParameter = event.url.searchParams.get("redirect");
        if (redirectParameter) throw redirect(307, redirectParameter);
        
        throw redirect(307, "dashboard");
    }
}