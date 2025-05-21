'use client';
import React, {useState} from 'react';
import {IconButton, Menu, MenuItem, Tooltip} from "@mui/material";
import {Apps, DeveloperBoard, Public, Radar, School} from "@mui/icons-material";
import Link from "next/link";

export default function AppPickerMenu() {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const close = () => {
        setAnchorEl(null);
    }

    return (
        <>
            <Tooltip title="VZJX Apps">
                <IconButton color="inherit" onClick={(e) => open(e)}>
                    <Apps/>
                </IconButton>
            </Tooltip>
            <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={close}>
                <Link href="https://zjxartcc.org" passHref style={{color: 'inherit', textDecoration: 'none',}}>
                    <MenuItem onClick={close}>
                        <Public sx={{mr: 1,}}/>Website
                    </MenuItem>
                </Link>
                <Link href="https://canvas.zjxartcc.org" passHref style={{color: 'inherit', textDecoration: 'none',}}>
                    <MenuItem disabled onClick={close}><School sx={{mr: 1,}}/>Student Center</MenuItem>
                </Link>
            </Menu>
        </>
    );
}