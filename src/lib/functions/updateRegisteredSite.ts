import { prisma } from "$lib/server/prisma";
import type { Prisma, RegisteredSite } from "@prisma/client";

type UpdateSiteProps = {
    updateData: (Prisma.Without<Prisma.RegisteredSiteUpdateInput, Prisma.RegisteredSiteUncheckedUpdateInput> & Prisma.RegisteredSiteUncheckedUpdateInput) | (Prisma.Without<Prisma.RegisteredSiteUncheckedUpdateInput, Prisma.RegisteredSiteUpdateInput> & Prisma.RegisteredSiteUpdateInput)
} & ({
    method: "id"
    id: number
} | {
    method: "unique"
    unique: string
})

export default async function updateRegisteredSite(data: UpdateSiteProps): Promise<({ error: true } | { error: false, updatedRegisteredSite: RegisteredSite })> {
    try {
        let updatedRegisteredSite: RegisteredSite;
        if (data.method === "id") {
            updatedRegisteredSite = await prisma.registeredSite.update({
                where: {
                    id: data.id
                },
                data: data.updateData
            });
        } else {
            updatedRegisteredSite = await prisma.registeredSite.update({
                where: {
                    unique: data.unique
                },
                data: data.updateData
            });
        }
        return { error: false, updatedRegisteredSite }
    } catch (err) {
        console.log({ updateSiteError: err });
        return { error: true }
    }
}