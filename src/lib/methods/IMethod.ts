import { Matrix } from "../Matrix";
import type { Step } from "../steps/Step";
import type { SolutionResult } from "../solution/SolutionResult";

export const MethodType = {
  Gauss: "Gauss",
  GaussJordan: "GaussJordan",
  InverseMatrix: "InverseMatrix",
} as const;

export type MethodType = typeof MethodType[keyof typeof MethodType];


// IMethod interface in TypeScript
export interface IMethod {
  getForwardSteps(matrix: Matrix): IterableIterator<Step>;
  backSubstitute(): SolutionResult;
}
