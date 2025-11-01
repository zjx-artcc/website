import React from 'react';
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

export default async function Page({ searchParams }: { searchParams: Promise<{ cid?: string }> }) {
    const session = await getServerSession(authOptions);
    const params = await searchParams;

    return (
        <Container maxWidth="md">
            <Card>
                {session && session.user.cid === params.cid && (
                    <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{mb: 2,}}>
                            <ErrorIcon color="error" fontSize="large"/>
                            <Typography variant="h5">Registration Error</Typography>
                        </Stack>
                        <Container maxWidth="sm">
                            <Typography>A registration with CID {params.cid} already exists.
                                If you believe that you have received this message in error, please
                                contact the vZJX Staff Team: zjx-staff@vatusa.net.</Typography>
                        </Container>
                    </CardContent>
                )}
                {(!session || session.user.cid != params.cid) && (
                    <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{mb: 2,}}>
                            <ErrorIcon color="error" fontSize="large"/>
                            <Typography variant="h5">You are not authorized to see this page.</Typography>
                        </Stack>
                        <Container maxWidth="sm">
                            <Typography align="center">If you believe that you have received this message in error,
                                please contact the vZJX Staff Team: zjx-staff@vatusa.net.
                            </Typography>
                        </Container>
                    </CardContent>
                )}
            </Card>
        </Container>

    );
}