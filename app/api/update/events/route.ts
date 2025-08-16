import {revalidatePath} from "next/cache";
import {updateSyncTime} from "@/actions/lib/sync";
import prisma from "@/lib/db";
import { UTApi } from "uploadthing/server";

export const dynamic = 'force-dynamic';

const ut = new UTApi();

export async function GET() {

    const in1Hour = new Date();
    in1Hour.setHours(in1Hour.getHours() + 1)

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    await prisma.event.updateMany({
        where: {
            manualPositionsOpen: false,
            start: {
                lte: in1Hour,
            },
            positionsLocked: false,
        },
        data: {
            positionsLocked: true,
        },
    });

    const archivedEvents = await prisma.event.findMany({
        where: {
            end: {
                lte: oneDayAgo,
            },
        },
    });

    for (const event of archivedEvents) {
        await ut.deleteFiles(event.bannerKey || '');

        await prisma.event.update({
            where: {
                id: event.id,
            },
            data: {
                archived: new Date(),
                hidden: true,
                positionsLocked: true,
                manualPositionsOpen: false,
                bannerKey: null,
            },
        });
    };

    await updateSyncTime({events: new Date(),});

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}