import { getSplitData, isEventMode } from "@/actions/centerSplit";
import { authOptions } from "@/auth/auth";
import SplitViewer from "@/components/CenterSplit/SplitViewer";
import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Page = async() => {
    const session = await getServerSession(authOptions);
    const splitData = await getSplitData()
    const {eventMode, eventModeUntil} = await isEventMode()
    let canManage = false

    if (session && (session.user.rating >= 2 && (session.user.controllerStatus.includes('HOME') || session.user.controllerStatus.includes('VISITOR')) || session.user.roles.some(r => ["STAFF"].includes(r)))) {
        canManage = true
    }

    return (
        <Grid2 gap={10}>
            <div className='flex flex-row gap-x-5'>
                <Typography variant='h4' sx={{marginBottom: 2}}>Operations Center</Typography>
                {canManage ? <Link href='/operations/manage' className='bg-sky-500 w-max h-max p-2'>Manage</Link> : ''}
            </div>
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