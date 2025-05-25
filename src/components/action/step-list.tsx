import React from "react";
import type { Step } from "@/lib/steps/Step";

interface StepListProps {
  steps: Step[];
  index: number;
}

const StepList: React.FC<StepListProps> = ({ steps, index }) => (
  <div className="flex flex-col gap-2">
    {steps.slice(0, index + 1).map((s, i) => (
      <div key={i} className="p-2 border rounded-md">
        {s.print()}
      </div>
    ))}
  </div>
);

export default StepList;
