import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Grid2, Typography} from "@mui/material";
import StaffingRequestDecisionForm from "@/components/StaffingRequest/StaffingRequestDecisionForm";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const {id} = params;

    const staffingRequest = await prisma.staffingRequest.findUnique({
        where: {
            id: id,
        },
        include: {
            user: true,
        },
    });

    if (!staffingRequest) {
        notFound();
    }

    return (
        (<Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>Staffing Request - {staffingRequest.name}</Typography>
                <Grid2 container columns={2} spacing={2}>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography
                            variant="body2">{staffingRequest.user.firstName} {staffingRequest.user.lastName}</Typography>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="subtitle2">CID</Typography>
                        <Typography variant="body2">{staffingRequest.user.cid}</Typography>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="body2">{staffingRequest.user.email}</Typography>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            md: 1
                        }}>
                        <Typography variant="subtitle2">Staffing Name</Typography>
                        <Typography variant="body2">{staffingRequest.name}</Typography>
                    </Grid2>
                    <Grid2 size={2}>
                        <Typography variant="subtitle2">Description</Typography>
                        <Typography variant="body2">{staffingRequest.description}</Typography>
                    </Grid2>
                    <Grid2 size={2}>
                        <StaffingRequestDecisionForm staffingRequest={staffingRequest}/>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>)
    );
}