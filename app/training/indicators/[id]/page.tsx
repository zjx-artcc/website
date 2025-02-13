import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Stack, Typography} from "@mui/material";
import PerformanceIndicatorForm from "@/components/PerformanceIndicator/PerformanceIndicatorForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page({params}: { params: Promise<{ id: string }> }) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.includes("STAFF")) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">You must be staff to access this page.</Typography>
                </CardContent>
            </Card>
        );
    }

    const {id} = await params;

    const performanceIndicator = await prisma.performanceIndicatorTemplate.findUnique({
        where: {
            id,
        },
        include: {
            categories: {
                include: {
                    criteria: true,
                },
            },
        },
    });

    if (!performanceIndicator) {
        notFound();
    }


    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5">Edit Performance Indicator - {performanceIndicator.name}</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>General Information</Typography>
                    <PerformanceIndicatorForm performanceIndicator={performanceIndicator}/>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>New Category</Typography>
                </CardContent>
            </Card>
        </Stack>
    );
}