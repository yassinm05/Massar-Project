// app/api/confirm-custom-payment/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';


export async function POST(request: Request) {
try {
const { paymentIntentId, transactionId } = await request.json();


if (!paymentIntentId || !transactionId) {
return NextResponse.json({ error: 'paymentIntentId and transactionId required' }, { status: 400 });
}


// Attach metadata and mark succeeded
const updated = await stripe.paymentIntents.update(paymentIntentId, {
status: 'succeeded',
metadata: {
...((await stripe.paymentIntents.retrieve(paymentIntentId)).metadata || {}),
paypal_transaction_id: transactionId,
},
});


// Return the updated object minimal info
return NextResponse.json({ success: true, status: updated.status });
} catch (err: any) {
console.error('confirm-custom-payment error', err);
return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
}
}