import {revalidatePath} from "next/cache";
import {updateSyncTime} from "@/actions/lib/sync";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {

    // TODO

    await updateSyncTime({events: new Date(),});

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}