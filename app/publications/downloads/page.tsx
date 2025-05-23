import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import FileTable from "@/components/Files/FileTable";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Downloads | ZJX ARTCC',
    description: 'ZJX ARTCC downloads page',
};

export default async function Page() {

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