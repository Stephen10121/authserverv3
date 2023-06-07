import { loginSchema } from "$lib/schemas/schemas";
import { fail } from "@sveltejs/kit";
import { message, setError, superValidate } from "sveltekit-superforms/server";

export async function load(event) {
    const form = await superValidate(event, loginSchema);
    
    return { form }
}

export const actions = {
    default: async (event) => {
        const form = await superValidate(event, loginSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        console.log({username: form.data.username, password: form.data.password});

        event.setHeaders({
            'Access-Control-Allow-Origin': `*`
        });

        // return setError(form, 'overall', 'Invalid Login');
        
        return message(form, 'tfa');
        // return message(form, 'success');
    }
}