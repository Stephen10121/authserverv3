import { prisma } from "$lib/server/prisma";
import type { MyUser, Prisma } from "@prisma/client";

type SuccessfulFetch = {
    error: false
    user: MyUser
}

type FailedFetch = {
    error: true
}

export default async function myUserCreate(data: (Prisma.Without<Prisma.MyUserCreateInput, Prisma.MyUserUncheckedCreateInput> & Prisma.MyUserUncheckedCreateInput) | (Prisma.Without<Prisma.MyUserUncheckedCreateInput, Prisma.MyUserCreateInput> & Prisma.MyUserCreateInput)): Promise<(SuccessfulFetch | FailedFetch)> {
    let createdUser: MyUser;
    try {
        createdUser = await prisma.myUser.create({
            data: {
                name: data.name,
                username: data.username,
                hash: data.hash,
                email: data.email
            }
        });
    } catch (err) {
        console.log({createMyUserError: err});
        return { error: true }
    }

    return {
        error: false,
        user: createdUser
    }
}