import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {MailGroup} from "@/app/admin/mail/page";
import {Card, CardContent, Typography} from "@mui/material";
import BroadcastForm from "@/components/Broadcast/BroadcastForm";

export default async function Page({params}: { params: Promise<{ id: string, }>, }) {

    const {id} = await params;

    const broadcast = await prisma.changeBroadcast.findUnique({
        where: {
            id,
        },
        include: {
            file: true,
        },
    });

    if (!broadcast) {
        notFound();
    }

    const users = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: "NONE",
            },
            receiveEmail: true,
        },
    });

    const groups: MailGroup[] = [
        {
            name: 'Home Observers',
            ids: users.filter(user => user.rating === 1 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home S1',
            ids: users.filter(user => user.rating === 2 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home S2',
            ids: users.filter(user => user.rating === 3 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home S3',
            ids: users.filter(user => user.rating === 4 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home C1/C3',
            ids: users.filter(user => [5, 6, 7].includes(user.rating) && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Instructors',
            ids: users.filter(user => user.roles.includes("INSTRUCTOR")).map(user => user.id),
        },
        {
            name: 'Mentors',
            ids: users.filter(user => user.roles.includes("MENTOR")).map(user => user.id),
        },
        {
            name: 'Visiting Controllers',
            ids: users.filter(user => user.controllerStatus === "VISITOR").map(user => user.id),
        },
        {
            name: 'All Training Staff',
            ids: users.filter(user => user.roles.some((r) => ["MENTOR", "INSTRUCTOR"].includes(r))).map(user => user.id),
        },
    ];

    const files = await prisma.file.findMany({
        orderBy: {
            order: 'asc',
        },
    })

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Edit Broadcast - {broadcast.title}</Typography>
                <BroadcastForm allFiles={files} groups={groups} broadcast={broadcast}
                               file={broadcast.file || undefined}/>
            </CardContent>
        </Card>
    );
}