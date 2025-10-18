"use client";

import { useState, ChangeEvent } from "react";
import JobApply from "@/components/jobs/jobApplication/JobApply";
import JobSubmit from "@/components/jobs/jobApplication/JobSubmit";
import JobConfirmation from "@/components/jobs/jobApplication/JobConfirmation";
import { submitJobApplication } from "@/actions/job-actions";

// ✅ Define the structure of your form data
interface JobApplicationFormData {
  jobId: number;
  ResumeFile: File | null;
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

// ✅ Define component props
interface JobsApplicationProps {
  id: number;
}

// ✅ Main component
export default function JobsApplication({ id }: JobsApplicationProps) {
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string>("");

  const [formData, setFormData] = useState<JobApplicationFormData>({
    jobId: id,
    ResumeFile: null,
    LicenseCertificateNumber: "",
    PreviousWorkExperience: "",
    NursingCompetencies: "",
    PreferredShift: "",
    CoverLetter: "",
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  // ✅ Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle file uploads
  const handleFileChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      ResumeFile: file,
    }));
  };

  // ✅ Navigation between steps
  const handleNext = () => {
    if (step === 1) {
      if (formData.ResumeFile && formData.LicenseCertificateNumber.trim()) {
        setStep(2);
      } else {
        alert("Please fill all required fields in Step 1");
      }
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  // ✅ Handle submission
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await submitJobApplication({ formData });

      if (!response || response.status) {
        throw new Error("Failed to submit application");
      }

      if (response.confirmationNumber) {
        setConfirmationNumber(response.confirmationNumber);
      }

      setStep(3);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center items-center py-6">
      {step === 1 && (
        <JobApply
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleNext={handleNext}
        />
      )}

      {step === 2 && (
        <JobSubmit
          formData={formData}
          handleInputChange={handleInputChange}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}

      {step === 3 && (
        <JobConfirmation confirmationNumber={confirmationNumber} />
      )}
    </div>
  );
}
