import React from 'react';
import {Grid2, Typography} from "@mui/material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Metadata} from "next";
import EventsMenu from '@/components/Admin/EventsMenu';

export const metadata: Metadata = {
    title: 'Events | vZDC',
    description: 'vZDC events admin page',
};

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.some(r => ["EVENT_STAFF", "STAFF"].includes(r))) {
        return (
            <Typography variant="h5" textAlign="center">You do not have access to this page.</Typography>
        );
    }

    return (
        (<Grid2 container columns={9} spacing={2}>
            <Grid2
                size={{
                    xs: 9,
                    lg: 2
                }}>
                <EventsMenu />
            </Grid2>
            <Grid2 size="grow">
                {children}
            </Grid2>
        </Grid2>)
    );
}