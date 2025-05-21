import { canEditEvent, getCenterSectorId, getSplitData, isEventMode } from "@/actions/centerSplit";
import { authOptions } from "@/auth/auth";
import EventModeSelector from "@/components/CenterSplit/EventModeSelector";
import SplitViewer from "@/components/CenterSplit/SplitViewer";
import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { getServerSession } from "next-auth";

const Page = async() => {
    const session = await getServerSession(authOptions);
    const splitData = await getSplitData()
    const {eventMode, eventModeUntil} = await isEventMode()

    if ((!session || !(session.user.rating >= 2 && ((session.user.roles.includes('CONTROLLER')) || session.user.roles.includes('STAFF'))))) {
        return (
            <Typography variant="h5" textAlign="center">You do not have access to this page.</Typography>
        );
    }

    return (
        <div>
            <Typography variant='h4' sx={{marginBottom: 2}}>Manage Operations</Typography>
            {eventMode ? <Typography variant='h6'>Event mode is active until {eventModeUntil?.toUTCString()}. Only event staff can update operatons data.</Typography> : <Typography variant='h6'>Event mode is currently inactive. All users may edit operational parameters.</Typography>}
            
            <Grid2 container spacing={2} marginTop={2}>
                {process.env.NODE_ENV == 'development' || session.user.roles.includes('EVENT_STAFF') || session.user.staffPositions.includes('AWM') || session.user.staffPositions.includes('WM')
                ? <EventModeSelector eventMode={eventMode} eventModeUntil={eventModeUntil}/>
                : ''}
                

                <Card sx={{minHeight: 600, width: '100%'}}>
                    <CardContent>
                        <SplitViewer 
                        canEdit={session?.user.rating && session.user.rating >= 5 || session?.user.roles.some(r => ["STAFF"].includes(r))}
                        sectorData={splitData}
                        eventMode={eventMode}
                        isEventStaff={await canEditEvent()}
                        />
                    </CardContent>
                </Card>
            </Grid2> 
        </div>
        
    )
}

export default Page