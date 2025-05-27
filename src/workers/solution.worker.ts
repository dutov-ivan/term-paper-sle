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
import type { Matrix } from "@/lib/math/Matrix";
import { InverseMethod } from "@/lib/methods/InverseMethod";
import type { MatrixConfiguration } from "@/store/matrix";

export type SolutionWorker = {
  initializeSolution(method: MethodType, matrix: number[][]): Promise<void>;
  getNextStep(): StepMetadata | null;
  getPreviousStep(): StepMetadata | null;
  getCurrentMatrix(): MatrixConfiguration | null;
  getSteps(): StepMetadata[];
  skipAndFinishForward(): {
    results: SolutionResult | null;
    steps: StepMetadata[];
    matrix: MatrixConfiguration;
  } | null;
  skipAndFinishBackward(): MatrixConfiguration | null;
  getResult(): SolutionResult | null;
  reset(): void;
};

let methodInstance: IMethod | null = null;
let matrixInstance: Matrix | null = null;
let iterator: Iterator<Step> | null = null;
let appliedSteps: Step[] = [];

const solutionWorker: SolutionWorker = {
  async initializeSolution(
    method: MethodType,
    matrix: number[][]
  ): Promise<void> {
    const slaeMatrix = SlaeMatrix.fromNumbers(matrix);
    matrixInstance = slaeMatrix;
    methodInstance = createSolutionMethodFromType(method, slaeMatrix);
    iterator = methodInstance.getForwardSteps();
    appliedSteps = [];
    console.log(methodInstance);
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

  getCurrentMatrix(): MatrixConfiguration | null {
    if (methodInstance instanceof InverseMethod) {
      return {
        type: "inverse",
        adjusted: methodInstance.adjustedMatrix!.contents,
        inverse: methodInstance.inverseMatrix!.contents,
      };
    }
    return {
      type: "standard",
      matrix:
        matrixInstance?.contents.map((row) => row.map((value) => value)) ?? [],
    };
  },

  getSteps(): StepMetadata[] {
    return appliedSteps.map((step) => step.toMetadata());
  },

  skipAndFinishForward(): {
    results: SolutionResult | null;
    steps: StepMetadata[];
    matrix: MatrixConfiguration;
  } | null {
    if (!iterator || !methodInstance || !matrixInstance) return null;

    while (true) {
      const next = iterator.next();
      if (next.done) break;
      appliedSteps.push(next.value);
    }

    return {
      results: methodInstance.backSubstitute(),
      steps: appliedSteps.map((step) => step.toMetadata()),
      matrix:
        methodInstance instanceof InverseMethod
          ? {
              type: "inverse",
              adjusted: methodInstance.adjustedMatrix!.contents,
              inverse: methodInstance.inverseMatrix!.contents,
            }
          : {
              type: "standard",
              matrix: matrixInstance.contents,
            },
    };
  },

  skipAndFinishBackward(): MatrixConfiguration | null {
    if (!iterator || !methodInstance || !matrixInstance) return null;

    for (let i = appliedSteps.length - 1; i >= 0; i--) {
      const step = appliedSteps[i];
      const revertedMatrix = step.inverse(matrixInstance.contents);
      matrixInstance.contents = revertedMatrix;
      appliedSteps.pop();
    }

    return methodInstance instanceof InverseMethod
      ? {
          type: "inverse",
          adjusted: methodInstance.adjustedMatrix!.contents.map((row) =>
            row.map((value) => value)
          ),
          inverse: methodInstance.inverseMatrix!.contents.map((row) =>
            row.map((value) => value)
          ),
        }
      : {
          type: "standard",
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
