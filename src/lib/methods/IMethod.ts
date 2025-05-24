import type { Step } from "../steps/Step";
import type { SolutionResult } from "../solution/SolutionResult";

export const MethodType = {
  Gauss: "Gauss",
  GaussJordan: "GaussJordan",
  InverseMatrix: "InverseMatrix",
} as const;

export type MethodType = (typeof MethodType)[keyof typeof MethodType];

export interface IMethod {
  getForwardSteps(): IterableIterator<Step>;
  backSubstitute(): SolutionResult;
  run(matrix: number[][]): IterableIterator<Step>;
}
