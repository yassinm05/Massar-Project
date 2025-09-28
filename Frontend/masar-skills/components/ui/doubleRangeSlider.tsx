"use client";
import { useState } from "react";
interface Props {
  labelName: string;
}

export default function DoubleRangeSlider({labelName}:Props) {
  const [minValue, setMinValue] = useState(20);
  const [maxValue, setMaxValue] = useState(80);

  return (
    <div className="w-80 mx-auto">
      <label className="block mb-2 font-medium text-sm text-[#565D6D]">{labelName}:</label>

      {/* Slider container */}
      <div className="relative h-2">
        {/* Track */}
        <div className="absolute top-1/2 w-full h-1 bg-gray-300 rounded" />

        {/* Range highlight */}
        <div
          className="absolute top-1/2 h-1 bg-[#0083AD] rounded"
          style={{
            left: `${minValue}%`,
            right: `${100 - maxValue}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min="0"
          max="100"
          value={minValue}
          onChange={(e) => setMinValue(Math.min(+e.target.value, maxValue - 1))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
        />

        {/* Max thumb */}
        <input
          type="range"
          min="0"
          max="100"
          value={maxValue}
          onChange={(e) => setMaxValue(Math.max(+e.target.value, minValue + 1))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
        />

        {/* Thumbs styling */}
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            pointer-events: auto;
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid #0083AD;
            cursor: pointer;
            margin-top: 4px; /* shift up to center with track */
          }
          input[type="range"]::-moz-range-thumb {
            pointer-events: auto;
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid #0083AD;
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm mt-2 text-[#565D6D]">
        <span>{minValue}%</span>
        <span>{maxValue}%</span>
      </div>
    </div>
  );
}
