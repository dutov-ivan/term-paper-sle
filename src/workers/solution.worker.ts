import { expose } from "comlink";
import {
  createSolutionMethodFromType,
  type IMethod,
  type MethodType,
} from "@/lib/methods/IMethod";
import type { Step } from "@/lib/steps/Step";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import { SlaeMatrix } from "@/lib/math/slae-matrix";
import type { StepMetadata } from "@/lib/steps/StepMetadata";

let methodInstance: IMethod | null = null;
let matrixInstance: SlaeMatrix | null = null;
let iterator: Iterator<Step> | null = null;
let appliedSteps: Step[] = [];

const solutionWorker = {
  async initializeSolution(
    method: MethodType,
    matrix: number[][]
  ): Promise<void> {
    matrixInstance = SlaeMatrix.fromNumbers(matrix);
    methodInstance = createSolutionMethodFromType(method);
    iterator = methodInstance.run(matrixInstance);
    appliedSteps = [];
  },

  getNextStep(): StepMetadata | null {
    if (!iterator || !matrixInstance || !methodInstance) return null;

    const next = iterator.next();
    if (next.done) return null;

    appliedSteps.push(next.value);
    return next.value.toMetadata();
  },

  getPreviousStep(): StepMetadata | null {
    if (!matrixInstance || appliedSteps.length === 0) return null;

    const lastStep = appliedSteps.pop()!;
    const revertedMatrix = lastStep.inverse(matrixInstance.contents);

    matrixInstance.contents = revertedMatrix;
    return lastStep.toMetadata();
  },

  getCurrentMatrix(): number[][] {
    return matrixInstance?.contents ?? [];
  },

  getSteps(): StepMetadata[] {
    return appliedSteps.map((step) => step.toMetadata());
  },

  skipAndFinishForward(): {
    results: SolutionResult | null;
    matrix: number[][];
  } | null {
    if (!iterator || !methodInstance || !matrixInstance) return null;

    while (true) {
      const next = iterator.next();
      if (next.done) break;
      next.value.perform(matrixInstance);
      appliedSteps.push(next.value);
    }

    return {
      results: methodInstance.backSubstitute(),
      matrix: matrixInstance.contents,
    };
  },

  getResult(): SolutionResult | null {
    return methodInstance?.backSubstitute() ?? null;
  },

  reset(): void {
    iterator = null;
    methodInstance = null;
    matrixInstance = null;
    appliedSteps = [];
  },
};

expose(solutionWorker);
