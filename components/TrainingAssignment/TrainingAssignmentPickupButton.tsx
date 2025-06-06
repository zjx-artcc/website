'use client'
import React, {useState} from 'react';
import {TrainingAssignment} from "@prisma/client";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {Button, IconButton, Tooltip} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {GridActionsCellItem} from "@mui/x-data-grid";

export default function TrainingAssignmentPickupButton({id}: {
    id: string
}) {
    const [clicked, setClicked] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (clicked) {
            toast(`Training assignment deleted successfully!`, {type: 'success'});
            router.replace('/training/requests');
        } else {
            toast(`Click again to confirm deletion.`, {type: 'warning'});
            setClicked(true);
        }

    }

    return (
        <Tooltip title="Delete Training Assignment">
            <div>
                <Button
                    onClick={handleClick}
                    variant='contained'
                >
                    Pickup Training Assignment
                </Button>
            </div>
        </Tooltip>
    );
}