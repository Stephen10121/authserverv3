import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
    console.log('first')
    event.cookies.delete("G_PERS", {
        path: "/",
        secure: !dev,
    });
    event.cookies.delete("G_VAR", {
        path: "/",
        secure: !dev,
    });
    throw redirect(307, "/");
}