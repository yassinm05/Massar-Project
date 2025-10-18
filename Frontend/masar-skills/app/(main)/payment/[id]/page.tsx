import { getPaymentPlansAction } from "@/actions/payment-action";
import PaymentProvider from "@/components/payment/PaymentProvider";
import Payment from "@/components/payment/Payment";

// Import or define the PaymentPlan type
interface PaymentOption {
  type: string;
  displayText: string;
  amountPerInstallment: number;
  numberOfInstallments?: number;
}

interface PaymentPlan {
  courseId: number;
  courseTitle: string;
  options: PaymentOption[];
}

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  // Convert route param `id` (string) → number
  const courseId = Number(params.id);

  // Optional: Handle invalid IDs gracefully
  if (isNaN(courseId)) {
    throw new Error(`Invalid course ID: ${params.id}`);
  }

  const result = await getPaymentPlansAction(courseId);

  // Handle error case
  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to fetch payment plans");
  }

  // Type assertion with validation
  const paymentPlans = result.data as PaymentPlan;

  return (
    <PaymentProvider>
      <Payment paymentPlans={paymentPlans} />
    </PaymentProvider>
  );
}
