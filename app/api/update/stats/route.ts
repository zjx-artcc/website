import {revalidatePath} from "next/cache";
import { getAndComputeStats } from '@/actions/statistics';

export const dynamic = 'force-dynamic';

export async function GET() {
    await getAndComputeStats(new Date(Date.now() - 86400000 * 5), new Date())

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}