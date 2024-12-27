'use client';

import { Checklist, Edit, OpenInNew } from "@mui/icons-material";
import { getGridSingleSelectOperators, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { EventType } from "@prisma/client";
import Link from "next/link";
import EventDeleteButton from "./EventDeleteButton";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import DataTable, { containsOnlyFilterOperator, equalsOnlyFilterOperator } from "../DataTable/DataTable";
import { fetchEvents } from "@/actions/event";

export default function EventTable() {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            flex: 1,
        },
        {
            field: 'type',
            type: 'singleSelect',
            headerName: 'Type',
            flex: 1,
            sortable: false,
            valueOptions: Object.keys(EventType).map((model) => ({value: model, label: model})),
            filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
        },
        {
            field: 'start',
            type: 'dateTime',
            headerName: 'Start (GMT)',
            flex: 1,
            filterable: false,
        },
        {
            field: 'end',
            type: 'dateTime',
            headerName: 'End (GMT)',
            flex: 1,
            filterable: false,
        },
        {
            field: 'bannerKey',
            type: 'string',
            headerName: 'Banner',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return params.row.bannerKey ? <Link href={`https://utfs.io/f/${params.row.bannerKey}`} target="_blank" style={{ color: 'inherit', }}><OpenInNew /></Link> : 'N/A';
            },
        },
        {
            field: 'hidden',
            type: 'boolean',
            headerName: 'Hidden',
            flex: 1,
            sortable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            getActions: (params) => [
                <Tooltip title="Event Manager" key={`positions-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Checklist />}
                        label="Event Manager"
                        onClick={() => router.push(`/admin/events/${params.row.id}/manager`)}
                    />
                </Tooltip>,
                <Tooltip title="Edit Event" key={`edit-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Edit/>}
                        label="Edit Event"
                        onClick={() => router.push(`/admin/events/${params.row.id}`)}
                    />
                </Tooltip>,
                <EventDeleteButton event={params.row} />,
            ],
        }
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'start', sort: 'asc',}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const events = await fetchEvents(pagination, sortModel, filter);
                       return {
                           data: events[1],
                           rowCount: events[0],
                       };
                   }}/>
    )
}