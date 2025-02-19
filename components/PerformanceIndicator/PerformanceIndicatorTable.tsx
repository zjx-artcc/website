'use client';
import React from 'react';
import {GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import DataTable, {containsOnlyFilterOperator, equalsOnlyFilterOperator} from "@/components/DataTable/DataTable";
import PerformanceIndicatorDeleteButton from "@/components/PerformanceIndicator/PerformanceIndicatorDeleteButton";
import {fetchPerformanceIndicators} from "@/actions/performanceIndicator";
import {Tooltip} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {useRouter} from "next/navigation";

export default function PerformanceIndicatorTable({admin}: { admin?: boolean }) {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator,]
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            getActions: (params) => admin ? [
                <Tooltip title="Edit Performance Indicator" key={`edit-${params.row.id}`}>
                    <GridActionsCellItem
                        icon={<Edit/>}
                        label="Edit Performance Indicator"
                        onClick={() => router.push(`/training/indicators/${params.row.id}`)}
                    />
                </Tooltip>,
                <PerformanceIndicatorDeleteButton performanceIndicator={params.row}/>,
            ] : [],
        }
    ];

    return (
        <DataTable columns={columns} initialSort={[{field: 'name', sort: 'asc'}]}
                   fetchData={async (pagination, sortModel, filter) => {
                       const pis = await fetchPerformanceIndicators(pagination, sortModel, filter);
                       return {
                           data: pis[1],
                           rowCount: pis[0],
                       };
                   }}/>);
}