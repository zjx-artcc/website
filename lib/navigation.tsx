import React from "react";
import {
    Add,
    AddComment,
    AirplanemodeActive,
    BarChart,
    CalendarMonth,
    Description,
    FileOpen,
    Forum,
    Group,
    ListAlt,
    PersonAdd,
    PlusOne,
    Radar,
    Route,
    Celebration
} from "@mui/icons-material";

export type NavigationButton = {
    label: string,
    link?: string,
    icon: React.ReactNode,
    dropdown?: NavigationDropdown,
}

export type DropdownButton = {
    label: string,
    link: string,
    icon: React.ReactNode,
}

export type NavigationDropdown = {
    buttons: DropdownButton[],
}

export const NAVIGATION: NavigationButton[] = [
    {
        label: 'Pilots',
        icon: <AirplanemodeActive/>,
        dropdown: {
            buttons: [
                {
                    label: 'Chart Database',
                    link: '/charts',
                    icon: <Description/>,
                },
                {
                    label: 'Airports',
                    link: '/airports',
                    icon: <AirplanemodeActive/>,
                },
            ],
        },
    },
    {
        label: 'Controllers',
        icon: <Radar/>,
        dropdown: {
            buttons: [
                {
                    label: 'Roster',
                    link: '/controllers/roster/home',
                    icon: <ListAlt/>,
                },
                {
                    label: 'ARTCC Staff',
                    link: '/controllers/staff',
                    icon: <Group/>,
                },
                {
                    label: 'Visit ZJX',
                    link: '/visitor/new',
                    icon: <PersonAdd/>,
                },
                {
                    label: 'Statistics',
                    link: '/controllers/statistics',
                    icon: <BarChart/>,
                },
                {
                    label: 'Preferred Routes Database',
                    link: '/prd',
                    icon: <Route/>,
                },
                {
                    label: 'Sheetus Cheetus',
                    link: 'https://docs.google.com/spreadsheets/d/1qCbtxKFFDbw-mgrPj1b_I71AI3aQXQN-ER0olcFCEtk/edit?gid=1029729582#gid=1029729582',
                    icon: <PlusOne/>
                }
            ],
        },
    },
    {
        label: 'Publications',
        link: '/publications/downloads',
        icon: <FileOpen/>,
    },
    {
        label: 'Events',
        icon: <CalendarMonth/>,
        dropdown: {
            buttons: [
                {
                    label: 'ORLO2026',
                    link: '/live',
                    icon: <Celebration />,
                },
                {
                    label: 'Request Staffing',
                    link: '/staffing/new',
                    icon: <Add/>,
                },
                {
                    label: 'Upcoming Events',
                    link: '/events',
                    icon: <CalendarMonth/>,
                },
            ],
        },
    },
    {
        label: 'Operations',
        icon: <AirplanemodeActive/>,
        link: '/operations',
    },
    {
        label: 'Feedback',
        icon: <AddComment/>,
        link: '/feedback/new',
    },

    {
        label: 'Discord',
        icon: <Forum/>,
        link: '/discord',
    },
];