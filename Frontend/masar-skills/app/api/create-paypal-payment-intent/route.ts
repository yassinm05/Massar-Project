// app/api/create-paypal-payment-intent/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';


export async function POST(request: Request) {
try {
const { amount, courseId } = await request.json();


if (!amount) {
return NextResponse.json({ error: 'amount required' }, { status: 400 });
}


const paymentIntent = await stripe.paymentIntents.create({
amount: Math.round(amount * 100), // dollars -> cents
currency: 'usd',
payment_method_types: ['custom'],
payment_method_options: {
custom: {
payment_method: process.env.STRIPE_CUSTOM_PAYPAL_ID!,
},
},
metadata: {
courseId: courseId ?? 'unknown',
provider: 'paypal',
},
});


return NextResponse.json({
clientSecret: paymentIntent.client_secret,
paymentIntentId: paymentIntent.id,
});
} catch (err: any) {
console.error('create-paypal-payment-intent error', err);
return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
}
}