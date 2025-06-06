'use client';
import React from 'react';
import {User} from "next-auth";
import {GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {Upload, Visibility} from "@mui/icons-material";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {fetchRequests} from "@/actions/trainingAssignmentRequest";
import {formatZuluDate} from "@/lib/date";
import TrainerAssignmentRequestDeleteButton
    from "@/components/TrainerAssignmentRequest/TrainerAssignmentRequestDeleteButton";
import {useRouter} from "next/navigation";
import {getRating} from "@/lib/vatsim";
import {Lesson} from "@prisma/client";
import {Chip, Stack, Tooltip} from "@mui/material";
import Link from "next/link";

export default function TrainerAssignmentRequestsTable({manageMode}: { manageMode: boolean }) {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'student',
            flex: 1,
            headerName: 'Student',
            renderCell: (params) => {
                const color = params.row.student.controllerStatus === "HOME" ? 'default' : 'secondary';

                return (
                    <Tooltip title={`${params.row.student.controllerStatus}`}>
                        <Link href={`/admin/controller/${params.row.student.cid}`} target="_blank"
                                              style={{textDecoration: 'none',}}>
                            <Chip
                                key={params.row.student.id}
                                label={`${params.row.student.firstName} ${params.row.student.lastName}` || 'Unknown'}
                                size="small"
                                color={color}
                            />
                        </Link>
                    </Tooltip>
                )
            },
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'cid',
            flex: 1,
            headerName: 'CID',
            sortable: false,
            renderCell: (params) => params.row.student.cid,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'trainingType',
            flex: 1,
            headerName: 'Training Type',
            renderCell: (params) => params.row.trainingType,
            filterable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'lastSession',
            flex: 1,
            headerName: 'Last Training Session',
            renderCell: (params) => params.row.student.trainingSessions[0]?.tickets.map((ticket: {
                id: string,
                lesson: Lesson,
                passed: boolean,
            }) => {
                const color = ticket.passed ? 'success' : 'error';
                return (
                    <Chip
                        key={ticket.id}
                        label={ticket.lesson.identifier}
                        size="small"
                        color={color}
                        style={{margin: '2px'}}
                    />
                );
            }) || 'N/A',
            filterable: false,
            sortable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'submittedAt',
            flex: 1,
            headerName: 'Submitted At',
            renderCell: (params) => formatZuluDate(params.row.submittedAt),
            filterable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            getActions: (params) => [
                <GridActionsCellItem
                    key={params.row.id}
                    icon={<Visibility/>}
                    label="View Request"
                    onClick={() => router.push(`/training/requests/${params.row.id}`)}
                />,
                <GridActionsCellItem
                    key={params.row.id}
                    icon={<Upload/>}
                    label="Pickup Student"
                    onClick={() => {}}
                />,
                manageMode ? <TrainerAssignmentRequestDeleteButton key={params.row.id} request={params.row}/> : <></>,
            ],
            flex: 1,
        }
    ];

    return (
        <DataTable
            columns={columns}
            initialSort={[{field: 'submittedAt', sort: 'asc',}]}
            fetchData={async (pagination, sort, filter) => {
                const requests = await fetchRequests(pagination, sort, filter);
                return {data: requests[1], rowCount: requests[0]};
            }}
        />
    );
}