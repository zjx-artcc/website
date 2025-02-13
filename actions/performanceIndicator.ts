'use server';

import {z} from "zod";
import prisma from "@/lib/db";
import {after} from "next/server";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";

export const createOrUpdatePerformanceIndicator = async (formData: FormData) => {
    const piZ = z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Name is required"),
    });

    const result = piZ.safeParse({
        id: formData.get("id") as string,
        name: formData.get("name") as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const pi = await prisma.performanceIndicatorTemplate.upsert({
        where: {id: result.data.id},
        update: {name: result.data.name},
        create: {name: result.data.name},
    });

    after(async () => {
        if (result.data.id) {
            await log("UPDATE", "PERFORMANCE_INDICATOR_TEMPLATE", `Updated performance indicator ${pi.name}`);
        } else {
            await log("CREATE", "PERFORMANCE_INDICATOR_TEMPLATE", `Created performance indicator ${pi.name}`);
        }
    });

    revalidatePath("/training/indicators");

    return {performanceIndicator: pi};
}