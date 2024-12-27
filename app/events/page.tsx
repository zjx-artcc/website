import React from 'react';
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Events | vZDC',
    description: 'vZDC charts page',
};

export default async function Page() {

    return (
        <Container maxWidth="lg">
            <Card sx={{mb: 2,}}>
                <CardContent>
                    <Typography variant="h6">Legend</Typography>
                    <Stack direction="column" spacing={2} sx={{mt: 1,}}>
                        <Typography color="#f44336" fontWeight="bold" sx={{p: 1, border: 1,}}>Home</Typography>
                        <Typography color="#cd8dd8" fontWeight="bold"
                                    sx={{p: 1, border: 1,}}>Support/Optional</Typography>
                        <Typography color="#834091" fontWeight="bold"
                                    sx={{p: 1, border: 1,}}>Support/Required</Typography>
                        <Typography color="#66bb6a" fontWeight="bold" sx={{p: 1, border: 1,}}>Group Flight</Typography>
                        <Typography color="#ffa726" fontWeight="bold" sx={{p: 1, border: 1,}}>Training</Typography>
                    </Stack>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    {/* <EventCalendar events={events}/> */}
                </CardContent>
            </Card>
        </Container>

    );

}