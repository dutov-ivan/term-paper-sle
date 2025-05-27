import type { Step } from "../steps/Step";
import type { SolutionResult } from "../solution/SolutionResult";
import { GaussMethod } from "./GaussMethod";
import { JordanGaussMethod } from "./JordanGaussMethod";
import { InverseMethod } from "./InverseMethod";
import type { SlaeMatrix } from "../math/slae-matrix";

export const MethodType = {
  Gauss: "Gauss",
  GaussJordan: "GaussJordan",
  InverseMatrix: "InverseMatrix",
} as const;

export type MethodType = (typeof MethodType)[keyof typeof MethodType];

export const createSolutionMethodFromType = (
  type: MethodType,
  matrix: SlaeMatrix
) => {
  switch (type) {
    case MethodType.Gauss:
      return new GaussMethod(matrix);
    case MethodType.GaussJordan:
      return new JordanGaussMethod(matrix);
    case MethodType.InverseMatrix:
      return new InverseMethod(matrix);
    default:
      throw new Error(`Unknown method type: ${type}`);
  }
};

export const getMethodTypeFromClass = (method: IMethod): MethodType => {
  if (method instanceof GaussMethod) {
    return MethodType.Gauss;
  } else if (method instanceof JordanGaussMethod) {
    return MethodType.GaussJordan;
  } else if (method instanceof InverseMethod) {
    return MethodType.InverseMatrix;
  } else {
    throw new Error("Invalid method");
  }
};

// IMethod interface in TypeScript
export interface IMethod {
  getForwardSteps(): IterableIterator<Step>;
  backSubstitute(): SolutionResult;
  runToTheEnd(): Step[];
  matrix: SlaeMatrix | null;
}
