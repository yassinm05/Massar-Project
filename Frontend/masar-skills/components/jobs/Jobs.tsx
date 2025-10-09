import getJobsAction from "@/actions/job-actions";

export default function Jobs({ jobs,activeJob , onSelectJob}) {
 
  return (
    <div className="flex flex-col p-4 gap-4">
      {jobs.map((job,index)=>(
        <div onClick={()=>onSelectJob(job.id)} key={index} className={`flex flex-col rounded-xl border  gap-2.5 p-6 cursor-pointer ${job.id===activeJob?"border-[#0083AD] bg-[#F0F9FF]":"border-[#E5E7EB]"}`}>
            <div className="">
                <p className="font-semibold text-lg">{job.title}</p>
            </div>
            <div className="flex flex-col gap-1 text-[#6B7280]">
                <p>{job.companyName}</p>
                <p>{job.location}</p>
            </div>

        </div>
      ))}
    </div>
  )
}