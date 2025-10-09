"use client";
import { useState } from "react";

export default function FileUploader({ handleFileChange, resume }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file); // <-- call parent handler
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 py-14 px-6 text-center flex flex-col gap-6 transition-colors ${
        isDragging ? "border-[#0083AD] bg-[#F0F9FF]" : "border-[#1F2937]"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        onChange={(e) => handleFileChange(e.target.files[0])}
        className="hidden"
        id="resume-input"
        accept=".pdf,.doc,.docx"
      />
      <label htmlFor="resume-input" className="cursor-pointer">
        <p className="font-semibold text-gray-700">
          Click to Upload or drag and drop
        </p>
        <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
      </label>

      {resume && (
        <p className="text-sm text-teal-600 mt-2">
          ✓ {resume.name}
        </p>
      )}
    </div>
  );
}
