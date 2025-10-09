import { Progress } from "@/components/ui/progress";

export default function JobSubmit({formData ,handleInputChange,setStep,handleSubmit}) {
  return (
    <div className="w-[970px] rounded-lg px-4 py-5 bg-white flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Apply for Job</h2>
      <div className=" flex flex-col gap-3">
        <p className="text-[#1F2937] font-medium">Step 1 of 2</p>
        <Progress
          className="bg-[#9FE7FF]"
          className2="bg-[#0083AD]"
          value={100}
        />
      </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-lg  text-[#374151]">
            Previous Work Experience
          </label>
          <textarea
            name="PreviousWorkExperience"
            placeholder={`Describe your previous work experience.\nIf you don't have any, write N/A`}
            value={formData.workExperience}
            onChange={handleInputChange}
            className="w-full bg-[#F0F9FF] rounded-xl p-3.5  border border-[#D1E9F6]  focus:outline-none placeholder:text-[#9CA3AF] h-32 resize-none leading-6 placeholder:leading-6"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-lg  text-[#374151]">
            Nursing Competencies
          </label>
          <input
            type="text"
            name="NursingCompetencies"
            placeholder="e.g. Patient Assessment, IV Therapy, Medication Administration"
            value={formData.competencies}
            onChange={handleInputChange}
            className="w-full bg-[#F0F9FF] rounded-xl p-3.5  border border-[#D1E9F6]  focus:outline-none placeholder:text-[#9CA3AF] leading-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-lg  text-[#374151]">Preferred Shift</label>
          <input
          type="text"
          placeholder="type  your  Preferred  shift"
            name="PreferredShift"
            value={formData.preferredShift}
            onChange={handleInputChange}
            className="w-full bg-[#F0F9FF] rounded-xl p-3.5  border border-[#D1E9F6]  focus:outline-none placeholder:text-[#9CA3AF] leading-none"
          />

        </div>

        <div className="flex gap-10">
          <button
            onClick={() => setStep(1)}
            className="flex-1 py-3  border border-[#0083AD] text-[#0083AD]  rounded-xl font-semibold cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#0083AD] text-white rounded-xl font-semibold  py-3 cursor-pointer"
          >
            Submit
          </button>
        </div>
    </div>
  );
}
