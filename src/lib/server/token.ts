import pkg from "jsonwebtoken";
const { sign } = pkg;

export function createRefreshToken(userId: number) {
    return sign({ userId: userId }, import.meta.env.VITE_REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
}

export function createAccessToken(userId: number) {
    return sign({ userId: userId }, import.meta.env.VITE_ACCESS_TOKEN_SECRET, {expiresIn: "7d"});
}