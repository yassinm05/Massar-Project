import React, { useState } from "react";
import CourseCatalogFilter from "./CourseCatalogFilter";
import Link from "next/link";

export default function CourseCatalog({
  setDifficulty,
  filteredCourses,
  isLoading,
}) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleApplyFilters = () => {
    setDifficulty(selectedDifficulty);
  };

  return (
    <div className="px-16 py-6 flex flex-col gap-6">
      <div className="flex flex-col gap-7">
        <h1 className="font-bold text-3xl">Course Catalog</h1>
        <CourseCatalogFilter
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="flex flex-wrap gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          filteredCourses.map((course, index) => (
            <div
              className="border border-[#F3F4F6] flex flex-col rounded-2xl overflow-hidden w-[266px]"
              key={index}
            >
              <div className="w-[266px] h-[180px] bg-amber-200"></div>
              <div className="flex flex-col p-4 gap-4">
                <p className="font-semibold text-lg leading-6 text-[#171A1F]">
                  {course.title}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="leading-5 text-[#565D6D]">
                    {course.description}
                  </p>
                  <div className="flex gap-2 font-medium text-xs text-[#19191F]">
                    <div className="rounded-xl bg-[#F0FBFF] px-3 py-2">
                      {(course.durationHours / 24 / 7).toFixed(2)} Weeks
                    </div>
                    <div className="rounded-xl bg-[#F5FAF6] px-3 py-2">
                      {course.difficulty}
                    </div>
                  </div>
                </div>
                <Link href={`payment/${course.id}`} className="w-[230px] h-10 rounded-lg bg-[#0083AD] flex justify-center items-center font-semibold text-white">
                  Enroll Now
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
