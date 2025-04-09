import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import OrderList from "@/components/Order/OrderList";
import {updateCategoryOrder} from "@/actions/performanceIndicatorCategory";
import {ArrowBack} from "@mui/icons-material";
import Link from "next/link";

export default async function Page({params}: { params: Promise<{ id: string, }> }) {

    const {id} = await params;

    const performanceIndicator = await prisma.performanceIndicatorTemplate.findUnique({
        where: {
            id,
        },
        include: {
            categories: true,
        },
    });

    if (!performanceIndicator) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row">
                    <Link
                        href={`/training/indicators/${id}`}
                        style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5" sx={{mt: 1}} gutterBottom>Order - Performance Indicator Category</Typography>
                </Stack>
                <OrderList
                    items={performanceIndicator.categories.map((c) => ({id: c.id, name: c.name, order: c.order,}))}
                    onSubmit={updateCategoryOrder}/>
            </CardContent>
        </Card>
    );
}