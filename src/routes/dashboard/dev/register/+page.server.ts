import { registerWebsite } from "$lib/schemas/schemas";
import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import { prisma } from "$lib/server/prisma";

export async function load(event) {
    await event.parent();
    const form = await superValidate(event, registerWebsite);

    return {
        form,
    }
}


export const actions = {
    default: async (event) => {
        const form = await superValidate(event, registerWebsite);

        if (!form.valid) {
            return fail(400, { form });
        }

        await prisma.registeredSite.create({
            data: {
                logins: 0,
                url: form.data.url,
                name: form.data.name,
                unique: form.data.unique,
                owner: 1
            }
        });

        console.log(form.data);

        return message(form, 'success');
    }
}