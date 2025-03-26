'use client';
import React from 'react';
import {GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import {fetchRequests} from "@/actions/trainingAssignmentRequest";
import {formatZuluDate} from "@/lib/date";
import {getRating} from "@/lib/vatsim";
import {Card, CardContent, Chip,Tooltip, Typography} from "@mui/material";
import Link from "next/link";

export default function TrainingQueueTable() {


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
            field: 'rating',
            flex: 1,
            headerName: 'Rating',
            renderCell: (params) => getRating(params.row.student.rating),
            filterable: false,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'submittedAt',
            flex: 1,
            headerName: 'Submitted At',
            renderCell: (params) => formatZuluDate(params.row.submittedAt),
            filterable: false,
        }
    ];

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Training Queue</Typography>
                <DataTable
                    columns={columns}
                    initialSort={[{field: 'submittedAt', sort: 'asc',}]}
                    fetchData={async (pagination, sort, filter) => {
                        const requests = await fetchRequests(pagination, sort, filter);
                        return {data: requests[1], rowCount: requests[0]};
                    }}
                />
            </CardContent>
        </Card>
    );
}