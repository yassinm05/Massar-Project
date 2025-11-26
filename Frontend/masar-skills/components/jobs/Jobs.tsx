interface Job {
  id: number;
  title: string;
  companyName: string;
  location: string;
  description: string;
  qualifications: string;
  responsibilities: string;
}

interface JobsProps {
  jobs: Job[];
  activeJob: number | string | null;
  onSelectJob: (id: number) => void;
}

export default function Jobs({ jobs, activeJob, onSelectJob }: JobsProps) {
  return (
    <div className="flex flex-col p-4 gap-4">
      {jobs.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No jobs found</div>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            className={`flex flex-col rounded-xl border gap-2.5 p-6 cursor-pointer ${
              job.id === activeJob
                ? "border-[#0083AD] bg-[#F0F9FF]"
                : "border-[#E5E7EB]"
            }`}
          >
            <div>
              <p className="font-semibold text-lg">{job.title}</p>
            </div>
            <div className="flex flex-col gap-1 text-[#6B7280]">
              <p>{job.companyName}</p>
              <p>{job.location}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
