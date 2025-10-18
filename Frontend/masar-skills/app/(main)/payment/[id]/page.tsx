// app/(main)/payment/[id]/page.tsx
import { getPaymentPlansAction } from '@/actions/payment-action'; // adjust import
import PaymentProvider from '@/components/payment/PaymentProvider';
import Payment from '@/components/payment/Payment'; // adjust import

interface Props {
  params: {
    id: string;
  };
}

export default async function page({ params }: Props) {
  const { id } = params;
  const paymentPlans = await getPaymentPlansAction(id);
  
  return (
    <PaymentProvider>
      <Payment paymentPlans={paymentPlans.data} />
    </PaymentProvider>
  );
}