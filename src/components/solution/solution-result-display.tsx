import type { SolutionResult } from "@/lib/solution/SolutionResult";
import React from "react";

const SolutionResultDisplay = ({ result }: { result: SolutionResult }) => {
  return <div>{JSON.stringify(result, null, 2)}</div>;
};

export default SolutionResultDisplay;
