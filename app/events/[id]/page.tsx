import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {
    Box,
    Card,
    CardContent,
    Container,
    Grid2,
    Stack,
    Typography
} from "@mui/material";
import Image from "next/image";
import {UTApi} from "uploadthing/server";
import {format} from "date-fns";
import Markdown from "react-markdown";
import Placeholder from "@/public/img/logo_large.png";
import { formatZuluDate } from '@/lib/date';

const ut = new UTApi();

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const {id} = params;

    const event = await prisma.event.findUnique({
        where: {
            id,
            hidden: false,
        },
    });

    if (!event) {
        notFound();
    }

    const imageUrl = `https://utfs.io/f/${event.bannerKey}`;

    return (
        <Container maxWidth="md">
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <Grid2 container columns={2} spacing={2}>
                            <Grid2 size={2}>
                                <Box sx={{position: 'relative', width: '100%', minHeight: 400,}}>
                                    <Image
                                        src={imageUrl || Placeholder}
                                        alt={event.name} priority fill style={{objectFit: 'contain'}}/>
                                </Box>
                            </Grid2>
                            <Grid2 size={2}>
                                <Stack direction="column" spacing={1} sx={{mb: 4,}}>
                                    <Typography variant="h5">{event.name}</Typography>
                                    <Typography variant="subtitle1">
                                        {formatZuluDate(event.start)}
                                        - {formatZuluDate(event.end)}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2">{event.featuredFields.join(" • ") || 'No fields'}</Typography>
                                </Stack>
                                <Markdown>{event.description}</Markdown>
                            </Grid2>
                        </Grid2>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}

