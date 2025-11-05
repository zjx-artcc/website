import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const registrant = await prisma.liveRegistrant.findFirst({
        where: {
            OR: [
                { userId: session.user?.id },
                { cid: session.user?.id },
            ],
        },
    });

    if (!registrant) return NextResponse.json({ status: 'not_registered' });

    const paymentIntentId = registrant.stripePaymentIntentId;

    try {
        if (!registrant.paymentSuccessful && paymentIntentId) {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === "succeeded") {
                await prisma.liveRegistrant.update({
                    where: { id: registrant.id },
                    data: { paymentSuccessful: true },
                });
                return NextResponse.json({ status: 'fully_registered' });
            }
        }

        if (registrant.paymentSuccessful) {
            return NextResponse.json({ status: 'fully_registered' });
        } else {
            return NextResponse.json({
                status: 'registered_unpaid',
                registrantId: registrant.id,
            });
        }

    } catch (error) {
        console.error('Error checking Stripe payment status:', error);
        return NextResponse.json({
            status: 'registered_unpaid',
            registrantId: registrant.id,
        });
    }
}
