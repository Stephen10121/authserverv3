import { json } from '@sveltejs/kit';
import { verify } from 'jsonwebtoken';
import { prisma } from "$lib/server/prisma";
import type { MyUser, User } from '@prisma/client';
import myUserFind from '$lib/functions/myUserFind.js';

export async function POST(event) {
    const unsplitToken = event.request.headers.get("Authorization");
    if (!unsplitToken) return json({error: "Unauthorized."});

    const accessToken = unsplitToken.split(" ")[1];
    if (!accessToken) return json({error: "Unauthorized"});
    
    let body: { name: string };
    try {
        body = await event.request.json();
        if (!body.name) return json({error: "No body."});
    } catch (err) {
        return json({error: "No body."});
    }

    let payload: { userId: number };
    try {
        payload = verify(accessToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET) as any as { userId: number };
        if (!payload) return json({error: "Unauthorized"});
    } catch (_err) {
        return json({error: "Unauthorized"});
    }

    let userLookup = await myUserFind({ method: "id", id: payload.userId });
    if (userLookup.error) return json({error: "Unauthorized"});
    let user = userLookup.user;

    try {
        Promise.all([
            await prisma.myUser.update({
                where: {
                    id: user.id
                },
                data: {
                    name: body.name
                }
            }),
            await prisma.user.update({
                where: {
                    userName: user.username
                },
                data: {
                    name: body.name
                }
            })
        ]);
    } catch (err) {
        return json({error: "Failed to change name."});
    }
    return json({msg: "Success!"});
}