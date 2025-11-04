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

        let customerId = session.user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                name: session.user.fullName,
                email: session.user.email,
            });
            customerId = customer.id;

            await prisma.user.update({
                where: { id: session.user.id },
                data: { stripeCustomerId: customerId },
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            customer: customerId,
            metadata: {
                registrant_id: registrantId,
                event: 'ORLO2026',
            },
            description: "ORLO2026 Registration Fee",
            payment_method_types: ["card"],
            receipt_email: email.toString(),
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error("Error creating PaymentIntent:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
