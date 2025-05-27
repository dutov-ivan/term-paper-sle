import { expose } from "comlink";
import {
  createSolutionMethodFromType,
  getMethodTypeFromClass,
  type IMethod,
  type MethodType,
} from "@/lib/methods/IMethod";
import type { Step } from "@/lib/steps/Step";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import { SlaeMatrix } from "@/lib/math/slae-matrix";
import type { StepMetadata } from "@/lib/steps/StepMetadata";
import { Matrix } from "@/lib/math/Matrix";
import { InverseMethod } from "@/lib/methods/InverseMethod";
import type { MatrixConfiguration } from "@/store/matrix";

export type SolutionWorker = {
  setMethod: (method: MethodType) => void;
  setSlaeCell(row: number, col: number, value: number): Promise<void>;
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
  generateRandomMatrix(
    rows: number,
    cols: number,
    from: number,
    to: number
  ): Promise<number[][]>;
  setMatrix(matrix: number[][]): Promise<void>;
};

let methodInstance: IMethod | null = null;
let methodType: MethodType | null = null;
let matrixInstance: Matrix | null = null;
let iterator: Iterator<Step> | null = null;
let appliedSteps: Step[] = [];

const solutionWorker: SolutionWorker = {
  setMethod(method: MethodType): void {
    if (methodInstance) {
      const type = getMethodTypeFromClass(methodInstance);
      if (type === method) return;
    }

    if (!matrixInstance) {
      methodType = method;
      return;
    }

    methodInstance = createSolutionMethodFromType(
      method,
      matrixInstance as SlaeMatrix
    );

    iterator = methodInstance.getForwardSteps();
    appliedSteps = [];
  },
  async setSlaeCell(row: number, col: number, value: number): Promise<void> {
    if (!matrixInstance) throw new Error("Matrix is not initialized.");
    console.log(
      `WEBWORKER: Setting cell at (${row}, ${col}) to value ${value} in matrix.`
    );
    matrixInstance.set(row, col, value);
  },

  getNextStep(): StepMetadata | null {
    console.log("WEBWORKER: Getting next step.");
    console.log(iterator, matrixInstance, methodInstance);
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

  async generateRandomMatrix(
    rows: number,
    cols: number,
    from: number,
    to: number
  ): Promise<number[][]> {
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        const randomValue = Math.random() * (to - from) + from;
        row.push(randomValue);
      }
      matrix.push(row);
    }
    return matrix;
  },

  async setMatrix(matrix: number[][]): Promise<void> {
    matrixInstance = new Matrix(matrix);
    if (!methodType) return;
    solutionWorker.setMethod(methodType);
  },
};

expose(solutionWorker);
