import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

import { confirmPaymentStatus } from '@/actions/liveRegistrationManagement';

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
        }

        const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const registrantId = paymentIntent.metadata?.registrant_id;

            if (registrantId) {
                await confirmPaymentStatus(registrantId);
            } else {
                console.warn('No registrant_id found in PaymentIntent metadata');
            }
        }


        return NextResponse.json({ received: true }, { status: 200 });
    } catch (e) {
        console.error(`Webhook Error: ${e.message}`);
        return NextResponse.json({ received: true }, { status: 400 });
    }
}