import { wrap } from "comlink";
import Worker from "@/workers/solution.worker.ts?worker";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import type { MethodType } from "@/lib/methods/IMethod";
import type { StepMetadata } from "@/lib/steps/StepMetadata";

export const createSolutionWorker = () => {
  return wrap<{
    initializeSolution(method: MethodType, matrix: number[][]): Promise<void>;
    getNextStep(): StepMetadata | null;
    getPreviousStep(): StepMetadata | null;
    getCurrentMatrix(): number[][];
    getSteps(): StepMetadata[];
    skipAndFinishForward(): {
      results: SolutionResult | null;
      matrix: number[][];
    } | null;
    getResult(): SolutionResult | null;
    reset(): void;
  }>(new Worker());
};
