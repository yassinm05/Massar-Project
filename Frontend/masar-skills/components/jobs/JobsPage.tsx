'use client';

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Search from "@/public/assets/jobs/search.png";
import Jobs from "@/components/jobs/Jobs";
import JobDetails from "@/components/jobs/JobDetails";
import getJobsAction, { getJobByIdAction } from "@/actions/job-actions";

interface Job {
  id: number;
  title: string;
  description: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeJobId , setActiveJobId]=useState<number>()
  const [activeJob,setActiveJob]=useState<Job>();
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const result = await getJobsAction();
      
      if (result?.errors) {
        setError(result.errors.user);
        setJobs([]);
      } else {
        setJobs(result);
        setActiveJobId(result[0].id)
        setError(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  fetchJobs();
}, []);
  

useEffect(() => {
  const fetchActiveJob = async (jobId: number) => {
    setIsLoading(true);
    try {
      const result = await getJobByIdAction(jobId);
      
      if (result?.errors) {
        setError(result.errors.user);
      } else {
        setActiveJob(result);
        setError(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (activeJobId) {
    fetchActiveJob(activeJobId);
  }
}, [activeJobId]);
  return (
    <div className="bg-[#F9FAFB] p-6 flex gap-6">
      {/* LEFT SIDE: job list */}
      <div className="flex flex-col bg-white rounded-xl">
        <div className="flex flex-col p-4">
          <div className="flex items-center py-3 px-4 bg-[#F9FAFB] border border-[#E5E7EB] gap-3 rounded-xl">
            <div className="relative w-6 h-6">
              <Image src={Search} alt="" fill />
            </div>
            <input
              type="text"
              placeholder="Search for jobs, hospitals"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="h-0 w-full border-b border-[#E5E7EB]" />

        <Jobs
          jobs={jobs}
          activeJob={activeJobId}
          onSelectJob={setActiveJobId}
        />
      </div>

      {/* RIGHT SIDE: job details */}
      <JobDetails isLoading={isLoading} activeJob={activeJob} />
    </div>
  );
}
