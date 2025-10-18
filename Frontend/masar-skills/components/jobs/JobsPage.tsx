"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Search from "@/public/assets/jobs/search.png";
import Jobs from "@/components/jobs/Jobs";
import JobDetails from "@/components/jobs/JobDetails";
import getJobsAction, { getJobByIdAction } from "@/actions/job-actions";

// Update the Job interface to match what Jobs component expects
interface Job {
  id: number;
  title: string;
  description: string;
  companyName: string;
  location: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [activeJob, setActiveJob] = useState<Job | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await getJobsAction();
        if (result?.errors) {
          setErrorMessage(result.errors.user);
          setJobs([]);
        } else {
          setJobs(result);
          setFilteredJobs(result);
          setActiveJobId(result[0]?.id ?? null);
          setErrorMessage(null);
        }
      } catch {
        setErrorMessage("An unexpected error occurred");
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  // Fetch active job details
  useEffect(() => {
    const fetchActiveJob = async (jobId: number) => {
      setIsLoading(true);
      try {
        const result = await getJobByIdAction(jobId);
        if (result?.errors) {
          setErrorMessage(result.errors.user);
        } else {
          setActiveJob(result);
          setErrorMessage(null);
        }
      } catch {
        setErrorMessage("An unexpected error occurred");
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:outline-none bg-transparent w-full"
            />
          </div>
        </div>
        <div className="h-0 w-full border-b border-[#E5E7EB]" />
        <Jobs
          jobs={filteredJobs}
          activeJob={activeJobId}
          onSelectJob={setActiveJobId}
        />
      </div>
      {/* RIGHT SIDE: job details */}
      <JobDetails isLoading={isLoading} activeJob={activeJob} />
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
