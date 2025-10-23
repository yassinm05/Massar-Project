"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  moduleTitle: string;
  moduleDescription: string;
  moduleOrder: number;
}

export default function CourseModule({
  moduleTitle,
  moduleDescription,
  moduleOrder,
}: Props) {
  const [expandModule, setExpandModule] = useState(false);

  const toggleModule = () => {
    setExpandModule(!expandModule);
  };

  return (
    <div
      key={moduleOrder}
      className="border border-[#E5E7EB] rounded-lg overflow-hidden"
    >
      <button
        onClick={() => toggleModule()}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-left">
          Module {moduleOrder}: {moduleTitle}
        </span>
        {expandModule ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {expandModule && (
        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-[#E5E7EB]">
          <p className="text-sm text-[#565D6D] leading-6">
            {moduleDescription}
          </p>
        </div>
      )}
    </div>
  );
}
