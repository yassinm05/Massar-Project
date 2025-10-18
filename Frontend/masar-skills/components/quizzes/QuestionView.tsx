interface Option {
  optionId: number;
  optionText: string;
}

interface Question {
  questionId: number;
  questionText: string;
  questionType: string;
  points: number;
  options: Option[];
}

interface QuestionViewProps {
  currentQuestion: Question;
  handleOptionSelect: (questionId: number, optionId: number) => void;
  handleSubmit: () => void;
  selectedOption: number | null;
  submitState: string;
}

export default function QuestionView({
  currentQuestion,
  handleOptionSelect,
  selectedOption,
}: QuestionViewProps) {
  return (
    <div className="flex flex-col gap-8 p-8 rounded-xl bg-white">
      <p className="font-semibold text-2xl leading-8 text-[#1F2937]">
        {currentQuestion.questionText}
      </p>
      <div className="flex flex-col gap-4">
        {currentQuestion.options.map((option, index) => {
          return (
            <button
              onClick={() =>
                handleOptionSelect(currentQuestion.questionId, option.optionId)
              }
              key={index}
              className={`flex gap-8 rounded-lg border p-4  ${
                selectedOption === option.optionId
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <p className="font-bold text-[#4B5563]">
                {String.fromCharCode(65 + index)}.
              </p>
              <p className="leading-6 text-[#374151]">{option.optionText}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}