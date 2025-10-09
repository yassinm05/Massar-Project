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
    jobId:id,
    ResumeFile: null,
    LicenseCertificateNumber: '',
    PreviousWorkExperience: '',
    NursingCompetencies: '',
    PreferredShift: '',
    CoverLetter:'yousef',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      if ( formData.ResumeFile && formData.LicenseCertificateNumber) {
        setStep(2);
      } else {
        alert(`Please fill all fields on Step 1 $`);
      }
    }
  };

   const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
    console.log(`yousef ${formData}`);
      const response = await submitJobApplication({formData});

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setStep(3);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center items-center py-6">
        {step === 1 && (
          <JobApply formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleNext={handleNext}/>
        )}

        {step === 2 && (
          <JobSubmit formData={formData} handleInputChange={handleInputChange} setStep={setStep} handleSubmit={handleSubmit}/>
        )}

        {step === 3 && (
          <JobConfirmation/>
        )}
    </div>
  );
}