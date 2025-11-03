import React from 'react';
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'ORLO2026 Registration Success | vZJX',
    description: 'vZJX ORLO26 registration page',
};

export default function Page() {
    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 2, }}>
                        <CheckCircle color="success" fontSize="large" />
                        <Typography variant="h5">ORLO2026 Registration Receieved!</Typography>
                    </Stack>
                    <Container maxWidth="sm">
                        <Typography>Your ORLO2026 registration was succesfully received. You should have received an email
                            with information about your payment. Please follow our Discord for updates on the event!</Typography>
                    </Container>
                </CardContent>
            </Card>
        </Container>

    );
}