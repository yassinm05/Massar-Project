'use client'
import { useState } from 'react';
import JobApply from '@/components/jobs/jobApplication/JobApply';
import JobSubmit from '@/components/jobs/jobApplication/JobSubmit';
import JobConfirmation from '@/components/jobs/jobApplication/JobConfirmation';
import { submitJobApplication } from '@/actions/job-actions';

export default function JobsApplication({id}) {

  const [step, setStep] = useState(1);
  const [error ,setError] =useState('');
  const [Loading ,setLoading] =useState(false);
  const [formData, setFormData] = useState({
    jobId: id,
    ResumeFile: "",
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
  const [confirmationNumber, setConfirmationNumber] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      ResumeFile: file,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.ResumeFile && formData.LicenseCertificateNumber) {
        setStep(2);
      } else {
        alert(`Please fill all fields on Step 1 $`);
      }
    }
  };
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await submitJobApplication({ formData });
      console.log(response);
      if (response.status) {
        throw new Error("Failed to submit application");
      }
      setConfirmationNumber(response.confirmationNumber);
      setStep(3);
    } catch (err) {
      setError(err.message || "An error occurred");
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
        />
      )}

      {step === 3 && (
        <JobConfirmation confirmationNumber={confirmationNumber} />
      )}
    </div>
  );
}