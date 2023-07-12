import { prisma } from "$lib/server/prisma";
import type { MyUser } from "@prisma/client";

type FetchByHash = {
    method: "hash"
    hash: string
}

type FetchById = {
    method: "id"
    id: number
}

type SuccessfulFetch = {
    error: false
    user: MyUser
}

type FailedFetch = {
    error: true
}

/**
   * This function finds and returns the user. You can find the user either by "id" or "hash".
   *
   * @example
   * let userLookupRes = await myUserFind({
   *     method: "hash",
   *     hash: the_user_hash
   * });
   * or
   * let userLookupRes = await myUserFind({
   *     method: "id",
   *     id: the_user_id
   * });
   * If the user is found and theres no errors, the user will be given.
   * @example
   * let userLookupRes = {
   *    error: false,
   *    user: the_user
   * }
   * If the user is not found, or an error occurs, error will be set to true and no user will be provided.
   * @example
   * let userLookupRes = {
   *    error: true
   * }
   */
export default async function myUserFind(data: (FetchByHash | FetchById)): Promise<(SuccessfulFetch | FailedFetch)> {
    // This function find the user.
    let user: MyUser | null = null;

    try {
        if (data.method === "hash") user = await prisma.myUser.findFirst({ where: { hash: data.hash } });
        else if (data.method === "id") user = await prisma.myUser.findFirst({ where: { id: data.id } });
    } catch (err) {
        console.log({userFindError: err});
        return { error: true }
    }

    if (!user) return {error: true}
    return {error: false, user}
}