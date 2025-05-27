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
    this._stepper = new JordanGaussStepper(matrix, this.methodMetadata);
  }

  public getForwardSteps(): IterableIterator<Step> {
    if (!this.matrix) {
      throw new Error("Matrix not initialized");
    }
    this.iterator = this._stepper.getForwardSteps();
    return this.iterator;
  }

  backSubstitute(): SolutionResult {
    if (!this.matrix) {
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

    const roots = new Array<number>(this.matrix.rows);
    for (let i = 0; i < this.matrix.rows; i++) {
      roots[i] = this.matrix.get(i, this.matrix.cols - 1);
      this.methodMetadata.backSubstitutionOperations++;
    }

    return {
      result: SolutionResultType.Unique,
      roots,
    };
  }

  public analyzeEchelonForm(): SolutionResultType {
    let rank = 0;
    const matrix = this.matrix;
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
      this.methodMetadata.backSubstitutionOperations++;
      if (!isNearZero(matrix.get(row, col))) return false;
    }
    return true;
  }
}
