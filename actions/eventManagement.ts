'use server';

import prisma from "@/lib/db";
import { after } from "next/server";
import { log } from "./log";
import { Event } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const toggleEventHidden = async (event: Event) => {
    
    await prisma.event.update({
        where: {
            id: event.id,
        },
        data: {
            hidden: !event.hidden,
        }
    });

    revalidatePath(`/admin/events/${event.id}/manager`);

    after(async () => {
        await log("UPDATE", "EVENT", `${event.hidden ? 'Showed' : 'Hidden'} event ${event.name}.`);
    });
}

export const toggleEventArchived = async (event: Event) => {
        
        await prisma.event.update({
            where: {
                id: event.id,
            },
            data: {
                archived: event.archived ? null : new Date(),
                hidden: true,
            },
        });
    
        revalidatePath(`/admin/events/${event.id}/manager`);
    
        after(async () => {
            await log("UPDATE", "EVENT", `${event.archived ? 'Unarchived' : 'Archived'} event ${event.name}.`);
        });
    }