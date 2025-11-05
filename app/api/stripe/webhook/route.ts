import { error } from "next/dist/build/output/log"
import { NextRequest, NextResponse } from "next/server"


export const POST = async (req: NextRequest, res: NextResponse) => {
//     const logger = getLogger()
//     const body = await req.text()
//     const sig = req.headers.get("stripe-signature")

//     let event: Stripe.Event

//     logger.info("[Stripe] Processing webhook")

//     try {
//         event = stripe.webhooks.constructEvent(body, sig as string, STRIPE_WEBHOOK_SECRET)

//         logger.info({ type: event.type }, `[Stripe] Listening to Webhook Event!`)
//     } catch (err) {
//         error(err as string)
//         return new Response(`Webhook Error: ${(err as Error).message}`, {
//             status: 400,
//         })
//     }

//     try {
//         // Handle the event
//         switch (event.type) {
//             case "payment_intent.succeeded":
//                 const paymentIntent = event.data.object as Stripe.PaymentIntent;
//                 const registrantId = paymentIntent.metadata?.registrant_id;
//                 if (registrantId) { await confirmPaymentStatus(registrantId); }
//                 else {
//                     console.warn('No registrant_id in PaymentIntent metadata');
//                 }
//                 break
//         }
//     } catch (err) {
//         logger.error({ err }, `[Stripe] Webhook Error`)
//         return new Response("Webhook handler failed. View logs.", {
//             status: 400,
//         })
//     }

//     logger.info(`[Stripe] Successfully ran Webhook!`)

//     return NextResponse.json({ success: true })
 }