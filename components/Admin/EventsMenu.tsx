import { Home, ListAlt, QuestionAnswer, RecentActors } from "@mui/icons-material";
import { Badge, Card } from "@mui/material";

import { CalendarMonth } from "@mui/icons-material";
import { CardContent, Link, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import prisma from "@/lib/db";

export default async function EventMenu() {

    const staffingRequests = await prisma.staffingRequest.count();

    const ec = await prisma.user.findFirst({
        where: {
            staffPositions: {
                has: "EC"
            },
        },
        select: {
            firstName: true,
            lastName: true
        }
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" textAlign="center">Events Administration</Typography>
                <Typography variant="subtitle2"
                            textAlign="center">EC: {ec?.firstName} {ec?.lastName || 'N/A'}</Typography>
                <List>
                    <Link href="/events/admin/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Overview"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/events/admin/events" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <CalendarMonth/>
                            </ListItemIcon>
                            <ListItemText primary="Events"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/events/admin/event-presets" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <RecentActors/>
                            </ListItemIcon>
                            <ListItemText primary="Event Position Presets"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/events/admin/staffing-requests" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Badge color="primary" badgeContent={staffingRequests}>
                                    <QuestionAnswer/>
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Staffing Requests"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/events/admin/logs" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ListAlt/>
                            </ListItemIcon>
                            <ListItemText primary="Logs"/>
                        </ListItemButton>
                    </Link>
                </List>
            </CardContent>
        </Card>
    )
}