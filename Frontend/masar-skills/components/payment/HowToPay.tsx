import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface PaymentOption {
  type: string;
  displayText: string;
  amountPerInstallment: number;
  numberOfInstallments?: number;
}

interface PaymentPlans {
  options: PaymentOption[];
}

interface HowToPayProps {
  handleSelection: (key: string, value: any) => void;
  handleNext: () => void;
  selectedValue: string;
  paymentPlans: PaymentPlans;
}

export default function HowToPay({
  handleSelection,
  handleNext,
  selectedValue,
  paymentPlans,
}: HowToPayProps) {
  const handleConfirm = () => {
    // Validate that a payment method is selected
    if (!selectedValue) {
      alert("Please select a payment method");
      return;
    }

    // Find the selected option
    const selectedOption = paymentPlans.options.find(
      (option) => option.type === selectedValue
    );

    if (!selectedOption) {
      alert("Invalid payment method selected");
      return;
    }

    // Set the amount based on the selected option
    handleSelection("amount", selectedOption.amountPerInstallment);

    // If it's an installment plan, you might want to store additional data
    if (selectedOption.numberOfInstallments) {
      handleSelection(
        "numberOfInstallments",
        selectedOption.numberOfInstallments
      );
      handleSelection(
        "totalAmount",
        selectedOption.amountPerInstallment *
          selectedOption.numberOfInstallments
      );
    }

    // Move to next step
    handleNext();
  };

  return (
    <div className="w-full flex flex-col gap-7 pt-7">
      <p className="text-[#0D141C] font-bold text-3xl">
        Choose a Payment Method
      </p>

      <div>
        <div className="flex flex-col gap-3">
          <RadioGroup
            value={selectedValue}
            onValueChange={(value) => handleSelection("howToPay", value)}
            defaultValue="fullAmount"
          >
            {paymentPlans?.options?.length ? (
              paymentPlans.options.map((option, index) => (
                <label
                  key={index}
                  htmlFor={option.type}
                  className="flex justify-between p-4 items-center border border-[#CFDBE8] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col">
                    <p className="font-medium text-sm text-[#0D141C]">
                      {option.displayText}
                    </p>
                    <p className="text-sm text-[#47739E]">
                      ${option.amountPerInstallment}
                      {option.numberOfInstallments &&
                      option.numberOfInstallments > 1
                        ? ` × ${option.numberOfInstallments} payments`
                        : ""}
                    </p>
                  </div>
                  <RadioGroupItem value={option.type} id={option.type} />
                </label>
              ))
            ) : (
              <p className="text-red-500 text-sm">
                No payment options available
              </p>
            )}
          </RadioGroup>
        </div>
      </div>

      <div className="w-full flex justify-end">
        <button
          onClick={handleConfirm}
          disabled={!selectedValue}
          className="bg-[#0083AD] px-4 py-2 text-[#F9FAFB] font-bold rounded-xl hover:bg-[#006B8F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
