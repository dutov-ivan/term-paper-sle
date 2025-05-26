import { SlaeMatrix } from "../math/slae-matrix";
import type { SolutionResult } from "../solution/SolutionResult";
import type { Step } from "../steps/Step";
import type { IMethod } from "./IMethod";

export abstract class Method implements IMethod {
  abstract getForwardSteps(): IterableIterator<Step>;
  abstract backSubstitute(): SolutionResult;

  protected _iterations: number = 0;
  protected _elementaryOperations: number = 0;
  protected _iterator: IterableIterator<Step> | null = null;

  public get iterations(): number {
    return this._iterations;
  }

  public get elementaryOperations(): number {
    return this._elementaryOperations;
  }

  public matrix: SlaeMatrix | null = null;

  public run(matrix: SlaeMatrix): IterableIterator<Step> {
    if (this.matrix) {
      this._iterations = 0;
      this._elementaryOperations = 0;
    }
    this.matrix = matrix;

    this._iterator = this.getForwardSteps();
    return this._iterator;
  }

  public runToTheEnd() {
    if (!this._iterator) {
      throw new Error("Method not initialized. Call run() first.");
    }

    const steps: Step[] = [];
    for (const step of this._iterator) {
      steps.push(step);
      this._iterations++;
    }
    return steps;
  }

  public applyStep(step: Step): void {
    if (!this.matrix) {
      throw new Error("Matrix not initialized");
    }
    step.perform(this.matrix);
    this._elementaryOperations += 1;
    this._iterations++;
  }
}
