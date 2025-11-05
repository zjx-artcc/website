// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { authOptions } from '@/auth/auth';
import { getServerSession } from "next-auth";
import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { registrantId, attendingLive, email } = await req.json();

        if (!registrantId) {
            return NextResponse.json({ error: 'Missing registrantId' }, { status: 400 });
        }

        const amount = 5000;

        const registrant = await prisma.liveRegistrant.findFirst({
            where: {
                OR: [
                    { userId: session.user?.id },
                    { cid: session.user?.id },
                ],
            },
        });

        if (registrant?.stripePaymentIntentId) {
            const existingIntent = await stripe.paymentIntents.retrieve(registrant.stripePaymentIntentId);
            if (existingIntent.status !== 'succeeded') {
                return NextResponse.json({ clientSecret: existingIntent.client_secret });
            }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) throw new Error("User not found");

        const userFullName = user.fullName ?? "";
        const userEmail = user.email ?? "";

        if (!user) throw new Error("User not found");

        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                metadata: { fullName: userFullName },
                name: userFullName,
                email: userEmail,
            });
            customerId = customer.id;

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId },
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            customer: customerId!,
            metadata: {
                registrant_id: registrantId.toString(),
                event: 'ORLO2026',
            },
            description: "ORLO2026 Registration Fee",
            payment_method_types: ["card"],
            receipt_email: email!,
        });

        await prisma.liveRegistrant.update({
            where: { id: registrant?.id },
            data: { stripePaymentIntentId: paymentIntent.id },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error("Error creating PaymentIntent:", error);
        console.error("Missing or invalid parameter:", error.param);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
