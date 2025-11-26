"use client";

import {
  // useStripe,
  // useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
// import { useEffect, useState } from "react";

export default function ApplePayButton() {
  // const stripe = useStripe();
  // const [paymentRequest, setPaymentRequest] = useState(null);

  // useEffect(() => {
  //   if (!stripe) return;

  //   const pr = stripe.paymentRequest({
  //     country: "US",
  //     currency: "usd",
  //     total: { label: "Course Payment", amount: amount * 100 },
  //     requestPayerName: true,
  //     requestPayerEmail: true,
  //   });

  //   pr.canMakePayment().then((result) => {
  //     if (result) setPaymentRequest(pr);
  //   });
  // }, [stripe]);

  // if (!paymentRequest) return <p>Apple Pay not supported.</p>;

  return (
    <PaymentRequestButtonElement
      // options={{ paymentRequest }}
      className="w-full"
    />
  );
}
