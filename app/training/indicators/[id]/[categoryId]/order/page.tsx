import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Order/OrderList";
import {updateCriteriaOrder} from "@/actions/performanceIndicatorCriteria";

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
                <Typography variant="h5" gutterBottom>Order - Performance Indicator Criteria</Typography>
                <OrderList items={category.criteria.map((c) => ({id: c.id, name: c.name, order: c.order,}))}
                           onSubmit={updateCriteriaOrder}/>
            </CardContent>
        </Card>
    );
}