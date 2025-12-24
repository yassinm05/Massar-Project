"use client";
import React from "react";

interface CourseCatalogFilterProps {
  selectedDifficulty: string;
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<string>>;
  handleApplyFilters: () => void;
}

export default function CourseCatalogFilter({
  selectedDifficulty,
  setSelectedDifficulty,
  handleApplyFilters,
}: CourseCatalogFilterProps) {
  return (
    <div className="w-full flex items-center justify-between border border-[#F3F4F6] p-4 rounded-xl max-sm:flex-col max-sm:gap-4">
      <div className="flex items-center gap-3 max-sm:flex-col max-sm:gap-4">
        <label className="font-medium text-sm text-[#565D6D]">
          Difficulty:
        </label>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-4 py-2 border rounded-md border-[#DEE1E6] focus:outline-none focus:ring-2 focus:ring-[#DEE1E6]"
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-[126px] flex justify-center items-center bg-[#0083AD] rounded-md text-white font-medium py-2 hover:bg-[#006688] transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}
