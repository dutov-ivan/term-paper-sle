import { DecimalMatrix } from "../math/DecimalMatrix";
import type { SolutionResult } from "../solution/SolutionResult";
import type { Step } from "../steps/Step";
import type { IMethod } from "./IMethod";

export abstract class Method implements IMethod {
  abstract getForwardSteps(): IterableIterator<Step>;
  abstract backSubstitute(): SolutionResult;

  protected _iterations: number = 0;
  protected _elementaryOperations: number = 0;

  public get iterations(): number {
    return this.iterations;
  }

  public get elementaryOperations(): number {
    return this.elementaryOperations;
  }

  protected matrix: DecimalMatrix | null = null;

  public run(matrix: number[][]): IterableIterator<Step> {
    if (this.matrix) {
      this._iterations = 0;
      this._elementaryOperations = 0;
    }
    this.matrix = DecimalMatrix.fromNumbers(matrix);
    return this.getForwardSteps();
  }
}
