import { Matrix } from "../math/Matrix";
import type { Step } from "../steps/Step";
import type { IMethod } from "./IMethod";
import type { SolutionResult } from "../solution/SolutionResult";
import { Method } from "./Method";
import type { DecimalMatrix } from "../math/DecimalMatrix";

// MatrixMethod stub in TypeScript
export class MatrixMethod extends Method {
  getForwardSteps(matrix: DecimalMatrix): IterableIterator<Step> {
    throw new Error("Method not implemented.");
  }
  backSubstitute(): SolutionResult {
    throw new Error("Not implemented");
  }
}
