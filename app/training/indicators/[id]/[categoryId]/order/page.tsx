import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import OrderList from "@/components/Order/OrderList";
import {updateCriteriaOrder} from "@/actions/performanceIndicatorCriteria";
import {ArrowBack} from "@mui/icons-material";
import Link from "next/link";

export default async function Page({params}: { params: Promise<{ id: string, categoryId: string, }> }) {

    const {id, categoryId} = await params;

    const category = await prisma.performanceIndicatorCriteriaCategory.findUnique({
        where: {
            id: categoryId,
            templateId: id,
        },
        include: {
            criteria: true,
        },
    });

    if (!category) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2}>
                    <Link
                        href={`/training/indicators/${id}`}
                        style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5" sx={{mt: 1}} gutterBottom>Order - Performance Indicator Criteria</Typography>
                </Stack>
                <OrderList items={category.criteria.map((c) => ({id: c.id, name: c.name, order: c.order,}))}
                           onSubmit={updateCriteriaOrder}/>
            </CardContent>
        </Card>
    );
}