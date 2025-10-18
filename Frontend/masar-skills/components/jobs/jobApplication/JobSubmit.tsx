import { ChangeEvent } from "react";
import { Progress } from "@/components/ui/progress";

// Update the FormData interface to match JobApplicationFormData
interface FormData {
  jobId: number;
  ResumeFile: File | null; // Changed from File | string to File | null
  LicenseCertificateNumber: string;
  PreviousWorkExperience: string;
  NursingCompetencies: string;
  PreferredShift: string;
  CoverLetter: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface JobSubmitProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBack: () => void;
  handleSubmit: () => Promise<void> | void;
  loading?: boolean;
  error?: string;
}

export default function JobSubmit({
  formData,
  handleInputChange,
  handleBack,
  handleSubmit,
  loading,
  error,
}: JobSubmitProps) {
  return (
    <div className="w-[970px] rounded-lg px-4 py-5 bg-white flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Apply for Job</h2>
      <div className="flex flex-col gap-3">
        <p className="text-[#1F2937] font-medium">Step 2 of 2</p>
        <Progress className="bg-[#9FE7FF]" className2="bg-[#0083AD]" value={100} />
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Previous Work Experience */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-lg text-[#374151]">
          Previous Work Experience
        </label>
        <textarea
          name="PreviousWorkExperience"
          placeholder={`Describe your previous work experience.\nIf you don't have any, write N/A`}
          value={formData.PreviousWorkExperience}
          onChange={handleInputChange}
          className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] h-32 resize-none leading-6 placeholder:leading-6"
        />
      </div>

      {/* Nursing Competencies */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-lg text-[#374151]">Nursing Competencies</label>
        <input
          type="text"
          name="NursingCompetencies"
          placeholder="e.g. Patient Assessment, IV Therapy, Medication Administration"
          value={formData.NursingCompetencies}
          onChange={handleInputChange}
          className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] leading-none"
        />
      </div>

      {/* Preferred Shift */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-lg text-[#374151]">Preferred Shift</label>
        <input
          type="text"
          placeholder="Type your preferred shift"
          name="PreferredShift"
          value={formData.PreferredShift}
          onChange={handleInputChange}
          className="w-full bg-[#F0F9FF] rounded-xl p-3.5 border border-[#D1E9F6] focus:outline-none placeholder:text-[#9CA3AF] leading-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-10">
        <button
          onClick={handleBack}
          disabled={loading}
          className="flex-1 py-3 border border-[#0083AD] text-[#0083AD] rounded-xl font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-[#0083AD] text-white rounded-xl font-semibold py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}