import { Progress } from "@/components/ui/progress";
import FileUploader from "./FileUploader";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ResumeFile: File | null;
  LicenseCertificateNumber: string;
}

interface JobApplyProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (file: File) => void;
  handleNext: () => void;
}

export default function JobApply({
  formData,
  handleInputChange,
  handleFileChange,
  handleNext,
}: JobApplyProps) {
  return (
    <div className="w-[970px] rounded-lg px-4 py-5 bg-white flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Apply for Job</h2>

      {/* Step indicator */}
      <div className="flex flex-col gap-3">
        <p className="text-[#1F2937] font-medium">Step 1 of 2</p>
        <Progress
          className="bg-[#9FE7FF]"
          className2="bg-[#0083AD]"
          value={50}
        />
      </div>

      {/* Name fields */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor="firstName" className="font-medium text-[#374151]">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] leading-none"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor="lastName" className="font-medium text-[#374151]">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] leading-none"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-medium text-[#374151]">
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] leading-none"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="font-medium text-[#374151]">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] leading-none"
        />
      </div>

      {/* Resume upload */}
      <div className="flex flex-col gap-2 px-4">
        <label className="font-bold text-lg text-[#1F2937]">Resume/CV</label>
        <FileUploader
          handleFileChange={handleFileChange}
          resume={formData.ResumeFile}
        />
      </div>

      {/* License */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="LicenseCertificateNumber"
          className="font-medium text-[#374151]"
        >
          License/Certification number
        </label>
        <input
          id="LicenseCertificateNumber"
          type="text"
          name="LicenseCertificateNumber"
          placeholder="e.g. RN123456"
          value={formData.LicenseCertificateNumber}
          onChange={handleInputChange}
          className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] leading-none"
        />
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="w-full bg-[#0083AD] text-white rounded-xl font-semibold py-3"
      >
        Next
      </button>
    </div>
  );
}
