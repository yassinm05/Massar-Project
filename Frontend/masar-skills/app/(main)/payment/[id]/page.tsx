import {
  getPaymentDetailsAction,
  getPaymentPlansAction,
} from "@/actions/payment-action";
import PaymentFlow from "@/components/payment/PaymentFlow";
import { PaymentDetails, PaymentPlan } from "@/types/payment";

interface Props {
  params: {
    id: string;
  };
}
export default async function Page({ params }: Props) {
  // 1. Get course price
  const courseId = Number(params.id);
  const details = await getPaymentDetailsAction(courseId);
  const plans = await getPaymentPlansAction(courseId);
  const paymentDetails = details.data as PaymentDetails;
  const paymentPlans = plans.data as PaymentPlan;

  return (
    <PaymentFlow paymentDetails={paymentDetails} paymentPlans={paymentPlans} />
  );
}
