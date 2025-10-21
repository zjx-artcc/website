import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {User} from "next-auth";
import {ControllerLogMonth} from "@prisma/client";
import {updateSyncTime} from "@/actions/lib/sync";
import { isEventMode, setAllSectors, getCenterSectorId } from "@/actions/centerSplit";
import { number } from "zod";
import { getPrefixes } from '@/actions/statisticsPrefixes';
import { getRosteredCids } from '@/actions/user';
import { log } from 'console';
import { getTotalHours } from '@/lib/hours';
import { getAndComputeStats } from '@/actions/statistics';

export const dynamic = 'force-dynamic';

export async function GET() {
    await getAndComputeStats(new Date(Date.now() - 86400000 * 5), new Date())

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}

