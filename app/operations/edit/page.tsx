import { getSplitData, isEventMode } from "@/actions/centerSplit";
import { authOptions } from "@/auth/auth";
import SplitViewer from "@/components/CenterSplit/SplitViewer";
import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { getServerSession } from "next-auth";

const Page = async() => {
    const session = await getServerSession(authOptions);
    const splitData = await getSplitData()
    const eventMode = await isEventMode()

    if (!session || !session.user.roles.some(r => ["STAFF"].includes(r))) {
        return (
            <Typography variant="h5" textAlign="center">You do not have access to this page.</Typography>
        );
    }

    return (
        <Grid2>
            <Typography variant='h4' sx={{marginBottom: 2}}>Manage Operations</Typography>
            {eventMode ? <Typography>Event mode is active until --:--Z. Only event staff can update operatons data.</Typography> : ''}

            <Card sx={{minHeight: 600, width: '100%'}}>
                <CardContent>
                    <SplitViewer 
                    sectorData={splitData}
                    eventMode={eventMode}/>
                </CardContent>
            </Card>
        </Grid2> 
    )
}

export default Page