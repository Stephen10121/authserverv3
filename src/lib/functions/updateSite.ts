import { prisma } from "$lib/server/prisma";
import type { Prisma, Sites } from "@prisma/client";

type UpdateSiteProps = {
    updateData: (Prisma.Without<Prisma.SitesUpdateInput, Prisma.SitesUncheckedUpdateInput> & Prisma.SitesUncheckedUpdateInput) | (Prisma.Without<Prisma.SitesUncheckedUpdateInput, Prisma.SitesUpdateInput> & Prisma.SitesUpdateInput)
    id: number
}

export default async function updateSite(data: UpdateSiteProps): Promise<({ error: true } | { error: false, updatedSite: Sites })> {
    try {
        const updatedSite = await prisma.sites.update({
            where: {
                id: data.id
            },
            data: data.updateData
        });
        return { error: false, updatedSite }
    } catch (err) {
        console.log({ updateSiteError: err });
        return { error: true }
    }
}