import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import Link from "next/link";
import {Card, CardContent, Typography} from "@mui/material";
import {Button, Stack} from "@mui/material";
import LiveRegistrantsTable from '@/components/Live/LiveRegistrantsTable';
export default async function Page() {
    const session = await getServerSession(authOptions);

    return session && (
        <>
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{mb: 2,}}>
                <Typography variant="h5">Overload 2026 Registrants</Typography>
            </Stack>
            <LiveRegistrantsTable />
        </>
    );
}