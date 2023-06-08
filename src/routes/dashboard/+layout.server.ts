import { createAccessToken } from '$lib/server/token.js';
import { redirect } from '@sveltejs/kit';
import { verify } from "jsonwebtoken";

export async function load({ cookies }) {
    const refreshToken = cookies.get("G_VAR");

    if (!refreshToken) throw redirect(307, "/");

    let payload: { userId: number };
    try {
        payload = verify(refreshToken, import.meta.env.VITE_REFRESH_TOKEN_SECRET) as any as { userId: number };
    } catch (_err) {
        cookies.delete("G_VAR");
        throw redirect(307, "/");
    }

    if (!payload) {
        cookies.delete("G_VAR");
        throw redirect(307, "/");
    }

    return {
        accessToken: createAccessToken(payload.userId)
    }
}