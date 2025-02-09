'use client';
import React from 'react';
import {GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import Link from "next/link";
import {Tooltip} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import BroadcastDeleteButton from "@/components/Broadcast/BroadcastDeleteButton";
import {fetchBroadcasts} from "@/actions/broadcast";
import BroadcastNotAgreedViewerButton from "@/components/Broadcast/BroadcastNotAgreedViewerButton";
import {formatZuluDate} from "@/lib/date";

export default function BroadcastTable() {

    const router = useRouter();
    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'timestamp',
            headerName: 'Updated At',
            filterable: false,
            flex: 1,
            renderCell: (params) => formatZuluDate(params.row.timestamp),
        },
        {
            field: 'file',
            headerName: 'File',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            renderCell: (params) => params.row.file ?
                <Link href={`/publications/${params.row.file.id}`} style={{color: 'inherit',}}
                      target="_blank">{params.row.file.name}</Link> : '',
        },
        {
            field: 'exemptStaff',
            type: 'boolean',
            headerName: 'Exempt Staff',
            flex: 1,
        },
        {
            field: 'agreed',
            type: 'number',
            headerName: 'Agreed',
            flex: 1,
            renderCell: (params) => `${params.row.agreedBy.length}/${params.row.seenBy.length + params.row.unseenBy.length + params.row.agreedBy.length}`,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            getActions: (params) => [
                <BroadcastNotAgreedViewerButton notAgreedBy={[...params.row.unseenBy, ...params.row.seenBy]}
                                                key={`notagreed-${params.row.id}`} broadcast={params.row}/>,
                <Tooltip title="Edit Broadcast" key={`edit-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Edit/>}
                        label="Edit Broadcast"
                        onClick={() => router.push(`/admin/broadcasts/${params.row.id}`)}
                    />
                </Tooltip>,
                <BroadcastDeleteButton key={`deletebtn-${params.row.id}`} broadcast={params.row}/>,
            ],
        }
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'timestamp', sort: 'asc',}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const broadcasts = await fetchBroadcasts(pagination, sortModel, filter);
                       return {
                           data: broadcasts[1],
                           rowCount: broadcasts[0],
                       };
                   }}/>
    );
}