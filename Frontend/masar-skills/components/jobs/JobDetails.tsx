import Image from "next/image";
import Link from "next/link";
import Check from "@/public/assets/jobs/check.png";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../framer-motion/motion";
import { FiArrowLeft } from "react-icons/fi";
import { Spinner } from "../ui/spinner";

interface Job {
  id: number | string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  qualifications: string;
  responsibilities: string;
}

interface JobDetailsProps {
  isLoading: boolean;
  activeJob?: Job;
  show: boolean;
  setActiveJob: (jobId: number | null) => void;
  setShow: (show: boolean) => void;
}

export default function JobDetails({
  isLoading,
  activeJob,
  show,
  setActiveJob,
  setShow,
}: JobDetailsProps) {
  const qualifications = activeJob?.qualifications
    .split(".")
    .filter(Boolean)
    .map((str) => str.trim());
  const responsibilities = activeJob?.responsibilities.split(",");

  const handleClick = () => {
    setShow(false);
    setActiveJob(null);
  };
  return (
    <>
      <div className="max-sm:hidden w-full bg-white rounded-xl h-full">
        {isLoading && <div className="p-6">Loading...</div>}

        {!isLoading && activeJob && (
          <div className="">
            {/* Job Header */}
            <div className="flex flex-col gap-2.5 p-6">
              <div>
                <p className="font-semibold text-2xl">{activeJob.title}</p>
              </div>
              <div className="flex flex-col gap-1 text-[#6B7280]">
                <p>{activeJob.companyName}</p>
                <p>{activeJob.location}</p>
              </div>
            </div>

            <div className="h-0 w-full border-b border-[#E5E7EB]" />

            {/* Job Description */}
            <div className="flex flex-col gap-2.5 p-6">
              <p className="text-lg font-semibold">Job Description</p>
              <p className="leading-6 text-[#6B7280]">
                {activeJob.description}
              </p>
            </div>
            {responsibilities && (
              <div className="flex flex-col gap-2.5 p-6">
                <p className="text-lg font-semibold">Responsibilities</p>
                <div className="flex flex-col gap-3">
                  {responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="relative w-6 h-6">
                        <Image src={Check} alt="" fill />
                      </div>
                      <p className="text-[#6B7280] leading-0">
                        {responsibility}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {qualifications && (
              <div className="flex flex-col gap-2.5 p-6">
                <p className="text-lg font-semibold">Responsibilities</p>
                <div className="flex flex-col gap-3">
                  {qualifications.map((qualification, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="relative w-6 h-6">
                        <Image src={Check} alt="" fill />
                      </div>
                      <p className="text-[#6B7280] leading-0">
                        {qualification}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-0 w-full border-b border-[#E5E7EB]" />

            {/* Apply Button */}
            <div className="p-6">
              <Link
                href={`/jobs/job-application/${activeJob.id}`}
                className="bg-[#0083AD] w-full h-12 rounded-xl cursor-pointer flex items-center justify-center"
              >
                <p className="text-white font-semibold">Apply Now</p>
              </Link>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {show && (
          <MotionDiv
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="sm:hidden fixed top-0 right-0 z-30 w-full bg-white rounded-xl h-full"
          >
            {isLoading && (
              <div className="p-6 w-screen h-screen flex justify-center items-center">
                <Spinner />
              </div>
            )}

            {!isLoading && activeJob && (
              <div className="">
                {/* Job Header */}
                <div className="flex flex-col gap-2.5 p-6 max-sm:px-4">
                  <div
                    onClick={handleClick}
                    className="w-fit flex gap-4 py-2 rounded-2xl items-center text-[#0082AD]  "
                  >
                    <FiArrowLeft className="w-4 h-4 " />
                    <p className="text-sm ">Back to Jobs</p>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl">{activeJob.title}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-[#6B7280]">
                    <p>{activeJob.companyName}</p>
                    <p>{activeJob.location}</p>
                  </div>
                </div>

                <div className="h-0 w-full border-b border-[#E5E7EB]" />

                {/* Job Description */}
                <div className="flex flex-col gap-2.5 p-6 max-sm:px-4">
                  <p className="text-lg font-semibold">Job Description</p>
                  <p className="leading-6 text-[#6B7280]">
                    {activeJob.description}
                  </p>
                </div>
                {responsibilities && (
                  <div className="flex flex-col gap-2.5 p-6 max-sm:px-4">
                    <p className="text-lg font-semibold">Responsibilities</p>
                    <div className="flex flex-col gap-3">
                      {responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <div className="relative w-6 h-6">
                            <Image src={Check} alt="" fill />
                          </div>
                          <p className="text-[#6B7280] leading-0">
                            {responsibility}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {qualifications && (
                  <div className="flex flex-col gap-2.5 p-6 max-sm:px-4">
                    <p className="text-lg font-semibold">Responsibilities</p>
                    <div className="flex flex-col gap-3">
                      {qualifications.map((qualification, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <div className="relative w-6 h-6">
                            <Image src={Check} alt="" fill />
                          </div>
                          <p className="text-[#6B7280] leading-0">
                            {qualification}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-0 w-full border-b border-[#E5E7EB]" />

                {/* Apply Button */}
                <div className="p-6">
                  <Link
                    href={`/jobs/job-application/${activeJob.id}`}
                    className="bg-[#0083AD] w-full h-12 rounded-xl cursor-pointer flex items-center justify-center"
                  >
                    <p className="text-white font-semibold">Apply Now</p>
                  </Link>
                </div>
              </div>
            )}
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
