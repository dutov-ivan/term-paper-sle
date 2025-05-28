import { SlaeMatrix } from "../math/slae-matrix";
import type { SolutionResult } from "../solution/solution-result";
import type { Step } from "../steps/step";
import type { IMethod } from "./IMethod";

export type MethodMetadata = {
  iterations: number;
  elementaryOperations: number;
  backSubstitutionOperations: number;
};

export abstract class Method implements IMethod {
  abstract getForwardSteps(): IterableIterator<Step>;
  abstract backSubstitute(): SolutionResult;
  protected iterator?: IterableIterator<Step>;

  public methodMetadata: MethodMetadata = {
    iterations: 0,
    elementaryOperations: 0,
    backSubstitutionOperations: 0,
  };

  constructor(matrix: SlaeMatrix) {
    this.matrix = matrix;
  }

  public matrix: SlaeMatrix;

  public runToTheEnd() {
    if (!this.iterator) {
      throw new Error("Method not initialized. Call run() first.");
    }

    const steps: Step[] = [];
    for (const step of this.iterator) {
      steps.push(step);
    }
    return steps;
  }
}
