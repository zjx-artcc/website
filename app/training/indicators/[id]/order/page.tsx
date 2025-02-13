import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Order/OrderList";
import {updateCategoryOrder} from "@/actions/performanceIndicatorCategory";

export default async function Page({params}: { params: Promise<{ id: string }> }) {

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
                <Typography variant="h5" gutterBottom>Order - Performance Indicator Category</Typography>
                <OrderList
                    items={performanceIndicator.categories.map((c) => ({id: c.id, name: c.name, order: c.order,}))}
                    onSubmit={updateCategoryOrder}/>
            </CardContent>
        </Card>
    );
}