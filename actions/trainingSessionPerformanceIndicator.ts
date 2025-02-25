'use server';

import prisma from "@/lib/db";

export const getData = async (lessonId: string) => {
    return prisma.lessonPerformanceIndicator.findUnique({
        where: {
            lessonId,
        },
        include: {
            template: {
                include: {
                    categories: {
                        orderBy: {
                            order: 'asc',
                        },
                        include: {
                            criteria: {
                                orderBy: {
                                    order: 'asc',
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}