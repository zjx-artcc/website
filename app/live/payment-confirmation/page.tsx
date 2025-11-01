import React from 'react';
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import {CheckCircle} from "@mui/icons-material";
import {Metadata} from "next";


export default function Page() {
    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{mb: 2,}}>
                        <CheckCircle color="success" fontSize="large"/>
                        <Typography variant="h5">ORLO2026 Registration Receieved!</Typography>
                    </Stack>
                    <Container maxWidth="sm">
                        <Typography>Your ORLO2026 registration and payment was succesfully received. A receipt has been sent to the email associated with your VATSIM account. Please follow our Discord for updates on the event!</Typography>
                    </Container>
                </CardContent>
            </Card>
        </Container>

    );
}