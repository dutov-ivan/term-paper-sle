import { SlaeMatrix } from "../math/slae-matrix";
import type { SolutionResult } from "../solution/SolutionResult";
import type { Step } from "../steps/Step";
import type { IMethod } from "./IMethod";

export abstract class Method implements IMethod {
  abstract getForwardSteps(): IterableIterator<Step>;
  abstract backSubstitute(): SolutionResult;

  protected _iterations: number = 0;
  protected _elementaryOperations: number = 0;

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
    return this.getForwardSteps();
  }
}
