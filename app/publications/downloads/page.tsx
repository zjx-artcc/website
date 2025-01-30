import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import FileTable from "@/components/Files/FileTable";
import {Metadata} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import LoginButton from "@/components/Navbar/LoginButton";

export const metadata: Metadata = {
    title: 'Downloads | vZDC',
    description: 'vZDC downloads page',
};

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return <Card>
            <CardContent>
                <Typography variant="h5">Login Required</Typography>
                <Typography color="red" fontWeight="bold" gutterBottom>By order of the A.T.M, you must be logged in to
                    see this information.</Typography>
                <LoginButton session={session}/>
            </CardContent>
        </Card>;

    }

    const fileCategories = await prisma.fileCategory.findMany({
        include: {
            files: {
                orderBy: {
                    order: 'asc',
                },
            },
        },
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <Container maxWidth="lg">
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">Downloads</Typography>
                    </CardContent>
                </Card>
                {fileCategories.map((category) => (
                    <Card key={category.id}>
                        <CardContent>
                            <Typography variant="h6">{category.name}</Typography>
                            <FileTable files={category.files}/>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}