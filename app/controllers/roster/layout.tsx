import React from 'react';
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import RosterSearch from "@/components/Roster/RosterSearch";
import RosterTabs from "@/components/Roster/RosterTabs";
import {Metadata} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import LoginButton from "@/components/Navbar/LoginButton";

export const metadata: Metadata = {
    title: 'Roster | vZDC',
    description: 'vZDC roster page',
};

export const revalidate = 300;

export default async function Layout({children}: { children: React.ReactNode }) {

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