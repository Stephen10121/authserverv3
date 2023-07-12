import { verify } from "jsonwebtoken";

export default function verifyToken(data: { tokenType: "refresh" | "access", token: string }): ({error: true} | {error: false, payload: {userId: number}}) {
    let payload: { userId: number };
    try {
        payload = verify(data.token, data.tokenType === "access" ? import.meta.env.VITE_ACCESS_TOKEN_SECRET : import.meta.env.VITE_REFRESH_TOKEN_SECRET) as any as { userId: number };
        if (!payload) return {error: true}
    } catch (err) {
        console.log({verifyTokenError: err});
        return {error: true}
    }
    return {
        error: false,
        payload
    }
}