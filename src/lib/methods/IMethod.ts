import { Matrix } from "../Matrix";
import type { Step } from "../steps/Step";
import type { SolutionResult } from "../solution/SolutionResult";
import { GaussMethod } from "./GaussMethod";
import { JordanGaussMethod } from "./JordanGaussMethod";
import { MatrixMethod } from "./MatrixMethod";

export const MethodType = {
  Gauss: "Gauss",
  GaussJordan: "GaussJordan",
  InverseMatrix: "InverseMatrix",
} as const;

export type MethodType = (typeof MethodType)[keyof typeof MethodType];

export const CreateMethodFromType = (type: MethodType) => {
  switch (type) {
    case MethodType.Gauss:
      return new GaussMethod();
    case MethodType.GaussJordan:
      return new JordanGaussMethod();
    case MethodType.InverseMatrix:
      return new MatrixMethod();
    default:
      throw new Error(`Unknown method type: ${type}`);
  }
};

// IMethod interface in TypeScript
export interface IMethod {
  getForwardSteps(matrix: Matrix): IterableIterator<Step>;
  backSubstitute(): SolutionResult;
}
