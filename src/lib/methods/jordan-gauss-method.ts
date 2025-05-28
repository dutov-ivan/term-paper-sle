import { SlaeMatrix } from "../math/slae-matrix";
import {
  SolutionResultEnum,
  type SolutionResultType,
} from "../solution/solution-result-type";
import type { SolutionResult } from "../solution/solution-result";
import { Method } from "./Method";
import { JordanGaussStepper } from "./jordan-gauss-stepper";
import type { Step } from "../steps/step";
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
    if (solutionType !== SolutionResultEnum.Unique) {
      return {
        result: solutionType,
        description:
          solutionType === SolutionResultEnum.Infinite
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
      result: SolutionResultEnum.Unique,
      roots,
    };
  }

  public analyzeEchelonForm(): SolutionResultType {
    let rank = 0;
    const matrix = this.matrix;
    const rows = matrix.rows;
    const cols = matrix.cols - 1;

    for (let row = 0; row < rows; row++) {
      this.methodMetadata.iterations++;
      const isZeroRow = isNearZero(matrix.get(row, row));
      const rhs = matrix.get(row, cols);

      if (isZeroRow && !isNearZero(rhs)) return SolutionResultEnum.None;
      if (!isZeroRow) rank++;
    }

    return rank < cols
      ? SolutionResultEnum.Infinite
      : SolutionResultEnum.Unique;
  }
}
