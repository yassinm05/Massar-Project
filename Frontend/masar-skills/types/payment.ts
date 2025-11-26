// types/payment.ts
export interface PaymentOption {
  type: string;
  displayText: string;
  amountPerInstallment: number;
  numberOfInstallments?: number;
}

export interface PaymentPlan {
  courseId: number;
  courseTitle: string;
  instructorName:string,

  options: PaymentOption[];
}

export interface PaymentDetails {
  id: number;
  amount: number;
  currency: string;
  courseTitle?: string;
  instructorName?: string;
  originalPrice?: number;
  discount?: number;
  finalPrice?: number;
  courseId?: number;
}

export type PaymentMethodType = "card" | "paypal" | "applePay";

export interface FormData {
  courseId: number;
  courseTitle: string;
  instructorName:string,
  howToPay: string;
  discount:number,
  paymentMethod: PaymentMethodType | "";
  amount: number;
  transactionId: string | null;
  paymentDate: string | null;
  numberOfInstallments?: number;
  totalAmount?: number;
  finalPrice:number,
}