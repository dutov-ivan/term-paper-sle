import type { SolutionResult } from "../solution/SolutionResult";
import { SolutionResultType } from "../solution/SolutionResultType";
import { Method } from "./Method";
import { isNearZero } from "../math/utils";
import { StepSwapRows } from "../steps/StepSwapRows";
import { StepEliminate } from "../steps/StepEliminate";
import { SlaeMatrix } from "../math/slae-matrix";
import type { Step } from "../steps/Step";

export class GaussMethod extends Method {
  *getForwardSteps(): IterableIterator<Step> {
    if (!this._matrix) {
      throw new Error("Matrix not initialized");
    }
    const augmentedMatrix = this._matrix;

    for (let sourceRow = 0; sourceRow < augmentedMatrix.rows - 1; sourceRow++) {
      yield* this.performPivotSwap(augmentedMatrix, sourceRow);
      yield* this.performRowElimination(augmentedMatrix, sourceRow);
    }
  }

  private *performPivotSwap(augmentedMatrix: SlaeMatrix, sourceRow: number) {
    const pivotRow = this.findPivotRow(augmentedMatrix, sourceRow);
    if (isNearZero(augmentedMatrix.get(pivotRow, sourceRow))) {
      return;
    }
    if (pivotRow !== sourceRow) {
      this._elementaryOperations++;
      const step = new StepSwapRows(sourceRow, pivotRow);
      step.perform(augmentedMatrix);
      yield step;
    }
  }

  private *performRowElimination(
    augmentedMatrix: SlaeMatrix,
    sourceRow: number
  ) {
    for (
      let eliminationRow = sourceRow + 1;
      eliminationRow < augmentedMatrix.rows;
      eliminationRow++
    ) {
      const step = new StepEliminate(sourceRow, eliminationRow);
      if (!step.perform(augmentedMatrix, false)) {
        continue;
      }
      yield step;
    }
  }

  private findPivotRow(augmentedMatrix: SlaeMatrix, sourceRow: number) {
    let pivotRow = sourceRow;
    for (let i = sourceRow + 1; i < augmentedMatrix.rows; i++) {
      if (
        Math.abs(augmentedMatrix.get(i, sourceRow)) >
        Math.abs(augmentedMatrix.get(pivotRow, sourceRow))
      ) {
        pivotRow = i;
      }
    }
    return pivotRow;
  }

  backSubstitute(): SolutionResult {
    if (!this._matrix) {
      throw new Error("Matrix not initialized");
    }

    const solutionType = this.analyzeEchelonForm(this._matrix);
    if (solutionType !== SolutionResultType.Unique) {
      return {
        result: solutionType,
        description:
          solutionType === SolutionResultType.Infinite
            ? "General solution exists"
            : undefined,
      };
    }

    const roots = this.solveUpperTriangular(this._matrix);
    return {
      result: SolutionResultType.Unique,
      roots: roots,
    };
  }

  private solveUpperTriangular(matrix: SlaeMatrix): number[] {
    const roots = new Array<number>(matrix.rows);

    for (let row = matrix.rows - 1; row >= 0; row--) {
      let sum = matrix.get(row, matrix.cols - 1); // RHS value

      for (let col = row + 1; col < matrix.cols - 1; col++) {
        const coeff = matrix.get(row, col);
        sum -= coeff * roots[col];
      }

      const pivot = matrix.get(row, row);
      if (isNearZero(pivot)) {
        throw new Error("Unexpected zero pivot during back-substitution");
      }

      roots[row] = sum / pivot;
    }

    return roots;
  }

  private analyzeEchelonForm(matrix: SlaeMatrix): SolutionResultType {
    let rank = 0;
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
