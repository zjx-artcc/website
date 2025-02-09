'use server';

import prisma from "@/lib/db";
import {User} from "next-auth";

export const handleSeenBroadcast = async (user: User, broadcastId: string) => {
    await prisma.changeBroadcast.update({
        where: {
            id: broadcastId,
        },
        data: {
            unseenBy: {
                disconnect: {
                    id: user.id,
                },
            },
            seenBy: {
                connect: {
                    id: user.id,
                },
            }
        },
    });
}

export const handleAgreeBroadcast = async (user: User, broadcastId: string) => {
    const broadcast = await prisma.changeBroadcast.update({
        where: {
            id: broadcastId,
        },
        data: {
            unseenBy: {
                disconnect: {
                    id: user.id,
                },
            },
            seenBy: {
                disconnect: {
                    id: user.id,
                },
            },
            agreedBy: {
                connect: {
                    id: user.id,
                },
            }
        },
        include: {
            unseenBy: true,
            seenBy: true,
        },
    });

    if (broadcast.seenBy.length + broadcast.unseenBy.length === 0) {
        await prisma.changeBroadcast.delete({
            where: {
                id: broadcastId,
            },
        });
    }
}