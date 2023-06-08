import { loginSchema } from "$lib/schemas/schemas";
import { fail } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { message, setError, superValidate } from "sveltekit-superforms/server";
import type { User } from "@prisma/client";
import { compare } from "bcrypt";
import { createRefreshToken } from "$lib/server/token";
import { dev } from "$app/environment";

export async function load(event) {
    const form = await superValidate(event, loginSchema);
    
    return { form }
}

export const actions = {
    default: async (event) => {
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
        
        if (user.tfa === "1") return message(form, 'tfa');
        return message(form, 'success');
    }
}