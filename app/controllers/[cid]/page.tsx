import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Grid2, Typography} from "@mui/material";
import ProfileCard from "@/components/Profile/ProfileCard";
import {getServerSession, User} from "next-auth";
import StatisticsTable from "@/components/Statistics/StatisticsTable";
import {getMonthLog} from "@/lib/hours";
import ControllingSessionsTable from "@/components/Statistics/ControllingSessionsTable";
import {getMonth} from "@/lib/date";
import LoginButton from "@/components/Navbar/LoginButton";
import {authOptions} from "@/auth/auth";

export default async function Page(props: { params: Promise<{ cid: string }> }) {

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

    const params = await props.params;

    const {cid} = params;

    const user = await prisma.user.findUnique({
        where: {
            cid,
            controllerStatus: {
                not: 'NONE',
            },
        },
    });

    if (!user) {
        notFound();
    }

    const logs = await prisma.controllerLogMonth.findMany({
        where: {
            year: new Date().getFullYear(),
            log: {
                user: {
                    cid,
                },
            },
        },
        include: {
            log: {
                include: {
                    user: true
                }
            }
        }
    });

    const positionsWorked = await prisma.controllerPosition.findMany({
        where: {
            log: {
                user: {
                    cid,
                },
            },
            start: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            },
        },
        orderBy: {
            start: 'desc',
        },
    });

    return (
        (<Grid2 container columns={2} spacing={2}>
            <Grid2 size={2}>
                <ProfileCard user={user as User} viewOnly/>
            </Grid2>
            <Grid2
                size={{
                    xs: 2,
                    lg: 1
                }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">{new Date().getFullYear()} Statistics</Typography>
                        <StatisticsTable heading="Month" logs={getMonthLog(logs)}/>
                    </CardContent>
                </Card>
            </Grid2>
            <Grid2
                size={{
                    xs: 2,
                    lg: 1
                }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">{getMonth(new Date().getMonth())} Controlling Sessions</Typography>
                        <ControllingSessionsTable positions={positionsWorked}/>
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>)
    );
}