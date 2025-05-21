import { Matrix } from "../Matrix";
import type { Step } from "../steps/Step";
import type { IMethod } from "./IMethod";
import type { SolutionResult } from "../solution/SolutionResult";

// MatrixMethod stub in TypeScript
export class MatrixMethod implements IMethod {
  backSubstitute(): SolutionResult {
    throw new Error("Not implemented");
  }

  *getForwardSteps(matrix: Matrix): IterableIterator<Step> {
    throw new Error("Not implemented");
  }
}
