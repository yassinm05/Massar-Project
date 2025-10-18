import PaymentMethod from "./PaymentMethod";
import handlePaymentAction, { getPaymentDetailsAction } from "@/actions/payment-action";

export default async function PaymentMethodWrapper({ courseId,handleSelect,paymentMethod }) {
  // Server Action defined here
  const details = await getPaymentDetailsAction(courseId);

  return (
    <PaymentMethod
      paymentDetails={details.data}
      handleSelect={handleSelect}
      paymentMethod={paymentMethod}
    />
  );
}
