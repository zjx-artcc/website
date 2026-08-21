import React from 'react';
import {Card, CardContent, Container, Stack, Typography, Box} from "@mui/material";
import RosterSearch from "@/components/Roster/RosterSearch";
import RosterTabs from "@/components/Roster/RosterTabs";
import {Metadata} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export const metadata: Metadata = {
    title: 'Roster | vZJX ARTCC',
    description: 'vZJX roster page',
};

export const revalidate = 300;

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);
        
    if (!session) {
            return (
                <Typography textAlign="center" variant="h5">You must login to view this page.</Typography>
            );
        }
    
    if (session.user.roles.length === 0) {
        return (
            <Box>
                <Typography textAlign="center" variant="h5">You must be a controller to access this
                    page.</Typography>
            </Box>
        );

    return (
        <Container maxWidth="lg">
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{mb: 1,}}>Controller Roster</Typography>
                        <RosterSearch/>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        {/*<RosterLegend/>*/}
                        <RosterTabs/>
                        {children}
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}
}