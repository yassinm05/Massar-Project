"use client";

import { useState, useEffect, useRef } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import handlePaymentAction from "@/actions/payment-action";

interface PaymentHandlerProps {
  courseId: number;
  amount: number | string;
  paymentMethod: string;
  paymentPlanType?: string;
  onPaymentSuccess: (transactionId: string, renewDate: string) => void;
}

export default function PaymentHandler({
  courseId,
  amount,
  paymentMethod,
  paymentPlanType = "one-time",
  onPaymentSuccess,
}: PaymentHandlerProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeApplePayment, setCanMakeApplePayment] = useState(false);

  // PayPal refs / guards
  const popupRef = useRef<Window | null>(null);
  const checkStatusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHandlingPayPalRef = useRef(false); // prevents re-entrancy

  const [
    {
      isPending: isPayPalPending,
      isResolved: isPayPalResolved,
      isRejected: isPayPalRejected,
    },
  ] = usePayPalScriptReducer();

  const stripeElementStyle = {
    base: {
      fontSize: "16px",
      color: "#47739E",
      fontFamily: "ui-monospace, monospace",
      "::placeholder": { color: "#94A3B8" },
    },
    invalid: { color: "#EF4444" },
  };

  // Cleanup helper
  const cleanupPayPal = () => {
    try {
      if (popupRef.current && !popupRef.current.closed)
        popupRef.current.close();
    } catch (e) {
      /* ignore */
    }
    popupRef.current = null;

    if (checkStatusTimerRef.current) {
      clearInterval(checkStatusTimerRef.current);
      checkStatusTimerRef.current = null;
    }

    try {
      window.localStorage.removeItem("paypal_order_id");
    } catch (e) {
      /* ignore */
    }

    isHandlingPayPalRef.current = false;
  };

  // cleanup on unmount
  useEffect(() => {
    return () => cleanupPayPal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset when switching payment methods
  useEffect(() => {
    setError(null);
    setSuccess(false);
    setProcessing(false);
    cleanupPayPal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod]);

  // Apple Pay setup (kept same behavior)
  useEffect(() => {
    if (!stripe || !amount) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Course Purchase",
        amount: Math.round(Number(amount) * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakeApplePayment(true);
      }
    });

    pr.on("paymentmethod", async (event) => {
      setProcessing(true);
      setError(null);
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(Number(amount) * 100),
            paymentMethodId: event.paymentMethod.id,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          event.complete("fail");
          setError(data.error || "Failed to create PaymentIntent");
          return;
        }

        const { error: confirmError, paymentIntent } =
          await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: event.paymentMethod.id,
          });

        if (confirmError) {
          event.complete("fail");
          setError(confirmError.message || "Payment failed");
          return;
        }

        event.complete("success");

        if (paymentIntent?.status === "succeeded") {
          await processPayment("apple", event.paymentMethod.id);
          setSuccess(true);
        } else {
          setError("Payment did not complete successfully");
        }
      } catch (err: any) {
        event.complete("fail");
        setError(err.message || "Apple Pay failed");
      } finally {
        setProcessing(false);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, amount]);

  // Common server-side recording of payment
  const processPayment = async (method: string, paymentToken: string) => {
    try {
      setProcessing(true);
      setError(null);

      const response = await handlePaymentAction(
          courseId,
          amount,
          method,
          paymentPlanType,
          paymentToken,
      );
      console.log(response);
      if (!response.success) {
        throw new Error(response.message || "Payment processing failed");
      }
      onPaymentSuccess(response.data.transactionId, response.data.nextPaymentDate);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Payment failed");
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  // Credit card handler (unchanged)
  const handleCreditCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card information is incomplete");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
        });

      if (pmError || !paymentMethod) {
        setError(pmError?.message || "Invalid card information");
        return;
      }

      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100),
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Server error creating payment intent");
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        await processPayment("credit", paymentMethod.id);
      } else {
        setError("Payment not completed");
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleApplePayClick = () => {
    if (paymentRequest) paymentRequest.show();
  };

  // PayPal custom popup flow with polling & guards
  const handleCustomPayPalPayment = async () => {
    // Prevent duplicated flows
    if (isHandlingPayPalRef.current) return;
    isHandlingPayPalRef.current = true;

    try {
      setProcessing(true);
      setError(null);
      cleanupPayPal();

      // 1) create order
      const createRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          amount: Number(amount).toFixed(2),
          paymentPlanType,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.message || "Failed to create PayPal order");
      }

      const orderID = createData.orderID;
      const approvalUrl =
        createData.approvalUrl ||
        createData.links?.find((l: any) => l.rel === "approve")?.href;
      if (!approvalUrl) throw new Error("No approval URL received from PayPal");

      try {
        window.localStorage.setItem("paypal_order_id", orderID);
      } catch (e) {
        /* ignore storage errors */
      }

      // open popup
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      popupRef.current = window.open(
        approvalUrl,
        "PayPal",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popupRef.current)
        throw new Error(
          "Failed to open PayPal popup. Please disable popup blocker."
        );

      // 2) Poll status (every 3s) and handle transitions
      let checkCount = 0;
      const maxChecks = 60; // ~3 minutes
      const intervalMs = 3000;

      checkStatusTimerRef.current = setInterval(async () => {
        checkCount++;
        if (checkCount >= maxChecks) {
          cleanupPayPal();
          setError("Payment timeout. Please try again.");
          setProcessing(false);
          return;
        }

        try {
          // If popup closed -> stop and show message
          if (popupRef.current && popupRef.current.closed) {
            cleanupPayPal();
            setError("Payment window closed");
            setProcessing(false);
            return;
          }

          const statusRes = await fetch(
            `/api/paypal/check-order-status/${orderID}`
          );
          if (!statusRes.ok) {
            // keep polling; backend might be temporarily unavailable
            console.log("check-order-status returned non-ok", statusRes.status);
            return;
          }
          const statusData = await statusRes.json();

          // if no status, break to avoid invisible infinite loop
          if (!statusData?.status) {
            cleanupPayPal();
            setError("Unable to verify payment status");
            setProcessing(false);
            return;
          }

          // accepted statuses: APPROVED -> need capture, COMPLETED -> already captured
          if (statusData.status === "APPROVED") {
            // stop polling and attempt capture
            cleanupPayPal();

            const captureRes = await fetch(
              `/api/paypal/capture-order/${orderID}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderID,
                  courseId,
                  amount,
                  paymentPlanType,
                }),
              }
            );

            const captureData = await captureRes.json();

            // If backend treats ORDER_ALREADY_CAPTURED as success it should return ok or success flag
            if (
              captureRes.ok &&
              (captureData.status === "COMPLETED" || captureData.success)
            ) {
              await processPayment("paypal", captureData.id || orderID);
              setSuccess(true);
              setProcessing(false);
              return;
            }

            // sometimes backend returns 422 with ORDER_ALREADY_CAPTURED details -> handle as success
            if (
              captureData?.details?.some?.(
                (d: any) => d.issue === "ORDER_ALREADY_CAPTURED"
              )
            ) {
              // interpret as successful (already captured)
              await processPayment("paypal", orderID);
              setSuccess(true);
              setProcessing(false);
              return;
            }

            // otherwise error
            const msg = captureData?.message || JSON.stringify(captureData);
            cleanupPayPal();
            setError(msg || "Failed to capture PayPal order");
            setProcessing(false);
            return;
          } else if (statusData.status === "COMPLETED") {
            // already captured upstream — success
            cleanupPayPal();
            await processPayment("paypal", orderID);
            setSuccess(true);
            setProcessing(false);
            return;
          } else if (["VOIDED", "CANCELLED"].includes(statusData.status)) {
            cleanupPayPal();
            setError("Payment was cancelled");
            setProcessing(false);
            return;
          } else {
            // other statuses (CREATED, PENDING...) -> continue polling
            console.log("PayPal order status:", statusData.status);
          }
        } catch (err) {
          console.log("Status check error:", err);
          // keep polling on transient errors
        }
      }, intervalMs);
    } catch (err: any) {
      setError(err.message || "PayPal payment failed");
      setProcessing(false);
      cleanupPayPal();
    } finally {
      // allow future flows (note: cleanupPayPal also clears this on success/timeouts)
      isHandlingPayPalRef.current = false;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200">
          Payment successful!
        </div>
      )}

      {/* Credit Card UI */}
      {paymentMethod === "credit" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="cardNumber" className="font-medium text-[#0D141C]">
              Card Number
            </label>
            <div className="border border-[#CFDBE8] bg-[#F7FAFC] rounded-xl px-4 py-3">
              <CardNumberElement
                id="cardNumber"
                options={{
                  style: stripeElementStyle,
                  placeholder: "0000 0000 0000 0000",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="cardExpiry"
                className="font-medium text-[#0D141C]"
              >
                Expiry Date
              </label>
              <div className="border border-[#CFDBE8] bg-[#F7FAFC] rounded-xl px-4 py-3">
                <CardExpiryElement
                  id="cardExpiry"
                  options={{ style: stripeElementStyle }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="cardCvc" className="font-medium text-[#0D141C]">
                CVC
              </label>
              <div className="border border-[#CFDBE8] bg-[#F7FAFC] rounded-xl px-4 py-3">
                <CardCvcElement
                  id="cardCvc"
                  options={{ style: stripeElementStyle }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCreditCardPayment}
            disabled={!stripe || processing}
            className="h-[48px] flex justify-center items-center rounded-xl bg-[#0083AD] text-[#F7FAFC] font-bold hover:bg-[#006B8F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : `Pay $${amount}`}
          </button>
        </div>
      )}

      {/* Apple Pay */}
      {paymentMethod === "apple" && (
        <div className="flex flex-col gap-3">
          {canMakeApplePayment ? (
            <button
              onClick={handleApplePayClick}
              disabled={!paymentRequest || processing}
              className="h-[48px] flex justify-center items-center rounded-xl bg-[#0083AD] text-[#F7FAFC] font-bold hover:bg-[#006B8F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : `Pay $${amount}`}
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Apple Pay is not supported on this device/browser.
            </p>
          )}
        </div>
      )}

      {/* PayPal */}
      {paymentMethod === "paypal" && (
        <div className="flex flex-col gap-3">
          {isPayPalPending && (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Loading PayPal...</p>
            </div>
          )}

          {isPayPalRejected && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              <p>Failed to load PayPal. Please refresh and try again.</p>
            </div>
          )}

          {isPayPalResolved && (
            <button
              onClick={handleCustomPayPalPayment}
              disabled={processing}
              className="h-[48px] flex justify-center items-center gap-2 rounded-xl bg-[#0083AD] text-[#F7FAFC] font-bold hover:bg-[#006B8F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing
                ? "Processing PayPal payment..."
                : `Pay with PayPal $${amount}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}