import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user?.id },
    });

    const hasStaffRole = user?.roles.includes("STAFF");

    if (!hasStaffRole) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const registrants = await prisma.liveRegistrant.findMany({
            where: {
                attendingLive: true,
                stripePaymentIntentId: { not: null },
            },
        });

        let updatedCount = 0;

        for (const registrant of registrants) {
            const pi = await stripe.paymentIntents.retrieve(
                registrant.stripePaymentIntentId!
            );

            if (pi.status === "succeeded" && !registrant.paymentSuccessful) {
                await prisma.liveRegistrant.update({
                    where: { id: registrant.id },
                    data: { paymentSuccessful: true },
                });
                updatedCount++;
            }
        }

        return NextResponse.json({
            status: "done",
            updated: updatedCount,
            total: registrants.length,
        });
    } catch (error: any) {
        console.error("Error refreshing payment status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
