import { Matrix } from "../Matrix";
import type { Step } from "../steps/Step";
import type { IMethod } from "./IMethod";
import type { SolutionResult } from "../solution/SolutionResult";
import { SolutionResultType } from "../solution/SolutionResultType";

// JordanGaussMethod stub in TypeScript
export class JordanGaussMethod implements IMethod {
  backSubstitute(): SolutionResult {
    throw new Error("Not implemented");
  }

  *getForwardSteps(matrix: Matrix): IterableIterator<Step> {
    throw new Error("Not implemented");
  }
}
