'use client';
import React from 'react';
import { User } from "next-auth";
import { GridColDef } from "@mui/x-data-grid";
import { Chip, IconButton } from "@mui/material";
import Link from "next/link";
import { Edit, Visibility } from "@mui/icons-material";
import TrainingSessionDeleteButton from "@/components/TrainingSession/TrainingSessionDeleteButton";
import { formatZuluDate, getDuration } from "@/lib/date";
import DataTable, { containsOnlyFilterOperator, equalsOnlyFilterOperator } from "@/components/DataTable/DataTable";
import { useRouter } from "next/navigation";
import { fetchRegistrants } from '@/actions/liveRegistrationManagement';
import { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Grid2, Stack, TextField, Typography } from "@mui/material";

export default function LiveRegistrantsTable() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'fName',
            flex: 1,
            headerName: 'First Name',
        },
        {
            field: 'lName',
            flex: 1,
            headerName: 'Last Name',
        },
        {
            field: 'cid',
            flex: 1,
            headerName: 'CID',
            renderCell: (params) => {
                const cid = params.value;
                return (
                    <Link href={'/controllers/${cid}'} style={{ textDecoration: 'none' }} target="_blank">
                        <Chip label={cid} color="primary" size="small" clickable />
                    </Link>
                )
            }
        },
        {
            field: 'preferredName',
            flex: 1,
            headerName: 'Preferred Name',
        },
        {
            field: 'registrantType',
            flex: 1,
            headerName: 'Registrant Type',
        },
        {
            field: 'attendingLive',
            flex: 1,
            headerName: 'Attending Live',
            renderCell: (params) => {
                return (
                    <Checkbox checked={Boolean(params.value)} readOnly color={params.value ? 'success' : 'error'} />
                )
            }
        },
        {
            field: 'usingHotelLink',
            flex: 1,
            headerName: 'Using Hotel Booking Link',
            renderCell: (params) => {
                return (
                    <Checkbox checked={Boolean(params.value)} readOnly color={params.value ? 'success' : 'error'} />
                )
            }
        },
        {
            field: 'paymentSuccessful',
            flex: 1,
            headerName: 'Payment Received',
            renderCell: (params) => {
                return (
                    <Checkbox checked={Boolean(params.value)} readOnly color={params.value ? 'success' : 'error'} />
                )
            }
        },
    ];

    if (!isMounted) return null;

    return (
        <>
            <DataTable
                columns={columns}
                initialSort={[{ field: 'fName', sort: 'asc' }]}
                fetchData={async (pagination, sortModel) => {
                    const [total, registrants] = await fetchRegistrants(pagination, sortModel);
                    return { data: registrants, rowCount: total };
                }}
            />

        </>

    );
}