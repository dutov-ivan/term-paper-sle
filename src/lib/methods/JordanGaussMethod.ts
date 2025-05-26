// Fix .abs() and .greaterThan() errors, and SolutionResult import
import { SlaeMatrix } from "../math/slae-matrix";
import { SolutionResultType } from "../solution/SolutionResultType";
import type { SolutionResult } from "../solution/SolutionResult";
import { Method } from "./Method";
import { JordanGaussStepper } from "./JordanGaussStepper";
import type { Step } from "../steps/Step";
import { isNearZero } from "../math/utils";

export class JordanGaussMethod extends Method {
  private _stepper: JordanGaussStepper;
  constructor(matrix: SlaeMatrix) {
    super(matrix);
    this._stepper = new JordanGaussStepper(matrix);
  }

  public getForwardSteps(): IterableIterator<Step> {
    if (!this._matrix) {
      throw new Error("Matrix not initialized");
    }
    this._iterator = this._stepper.getForwardSteps();
    return this._iterator;
  }

  backSubstitute(): SolutionResult {
    if (!this._matrix) {
      throw new Error("Matrix not initialized");
    }

    const solutionType = this.analyzeEchelonForm();
    if (solutionType !== SolutionResultType.Unique) {
      return {
        result: solutionType,
        description:
          solutionType === SolutionResultType.Infinite
            ? "General solution exists"
            : undefined,
      };
    }

    const roots = new Array<number>(this._matrix.rows);
    for (let i = 0; i < this._matrix.rows; i++) {
      roots[i] = this._matrix.get(i, this._matrix.cols - 1);
    }

    return {
      result: SolutionResultType.Unique,
      roots,
    };
  }

  public analyzeEchelonForm(): SolutionResultType {
    let rank = 0;
    const matrix = this._matrix;
    const rows = matrix.rows;
    const cols = matrix.cols - 1;

    for (let row = 0; row < rows; row++) {
      const isZeroRow = this.isZeroRow(matrix, row, cols);
      const rhs = matrix.get(row, matrix.cols - 1);

      if (isZeroRow && !isNearZero(rhs)) return SolutionResultType.None;
      if (!isZeroRow) rank++;
    }

    return rank < cols
      ? SolutionResultType.Infinite
      : SolutionResultType.Unique;
  }

  private isZeroRow(matrix: SlaeMatrix, row: number, cols: number): boolean {
    for (let col = 0; col < cols; col++) {
      if (!isNearZero(matrix.get(row, col))) return false;
    }
    return true;
  }
}
