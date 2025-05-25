// Fix .abs() and .greaterThan() errors, and SolutionResult import
import { SlaeMatrix } from "../math/slae-matrix";
import { SolutionResultType } from "../solution/SolutionResultType";
import type { SolutionResult } from "../solution/SolutionResult";
import { isNearZero } from "../math/utils";
import { Method } from "./Method";
import { StepEliminate } from "../steps/StepEliminate";
import { StepSwapRows } from "../steps/StepSwapRows";
import { StepScale } from "../steps/StepScale";
import type { Step } from "../steps/Step";

export class JordanGaussMethod extends Method {
  *getForwardSteps(): IterableIterator<Step> {
    if (!this.matrix) {
      throw new Error("Matrix not initialized");
    }
    const augmentedMatrix = this.matrix;

    for (let sourceRow = 0; sourceRow < augmentedMatrix.rows - 1; sourceRow++) {
      yield* this.performPivotSwap(augmentedMatrix, sourceRow);
      yield* this.performScaling(augmentedMatrix, sourceRow);
      yield* this.performElimination(augmentedMatrix, sourceRow, "down");
    }

    yield* this.performScaling(augmentedMatrix, augmentedMatrix.rows - 1);

    for (
      let sourceRow = augmentedMatrix.rows - 1;
      sourceRow >= 0;
      sourceRow--
    ) {
      yield* this.performElimination(augmentedMatrix, sourceRow, "up");
    }
  }

  private *performPivotSwap(augmentedMatrix: SlaeMatrix, sourceRow: number) {
    const pivotRow = this.findPivotRow(augmentedMatrix, sourceRow);
    if (isNearZero(Math.abs(augmentedMatrix.get(pivotRow, sourceRow)))) {
      return;
    }
    if (pivotRow !== sourceRow) {
      const step = new StepSwapRows(sourceRow, pivotRow);
      step.perform(augmentedMatrix);
      this._elementaryOperations++;
      yield step;
    }
  }

  private *performScaling(augmentedMatrix: SlaeMatrix, sourceRow: number) {
    const step = new StepScale(sourceRow);
    if (step.perform(augmentedMatrix)) {
      this._elementaryOperations++;
      yield step;
    }
  }

  private *performElimination(
    augmentedMatrix: SlaeMatrix,
    sourceRow: number,
    direction: "up" | "down"
  ) {
    const start = direction === "down" ? sourceRow + 1 : 0;
    const end = direction === "down" ? augmentedMatrix.rows : sourceRow;
    const stepInc = direction === "down" ? 1 : 1;
    for (
      let eliminationRow = start;
      eliminationRow < end;
      eliminationRow += stepInc
    ) {
      if (eliminationRow === sourceRow) continue;
      const step = new StepEliminate(sourceRow, eliminationRow);
      if (!step.perform(augmentedMatrix)) {
        continue;
      }
      this._elementaryOperations++;
      yield step;
    }
  }

  private findPivotRow(augmentedMatrix: SlaeMatrix, sourceRow: number) {
    let pivotRow = sourceRow;
    for (let row = sourceRow + 1; row < augmentedMatrix.rows; row++) {
      if (
        Math.abs(augmentedMatrix.get(row, sourceRow)) >
        Math.abs(augmentedMatrix.get(pivotRow, sourceRow))
      ) {
        pivotRow = row;
      }
    }
    return pivotRow;
  }

  backSubstitute(): SolutionResult {
    if (!this.matrix) {
      throw new Error("Matrix not initialized");
    }

    const solutionType = this.analyzeEchelonForm(this.matrix);
    if (solutionType !== SolutionResultType.Unique) {
      return {
        result: solutionType,
        generalForm:
          solutionType === SolutionResultType.Infinite
            ? "General solution exists"
            : undefined,
      };
    }

    const roots = new Array<number>(this.matrix.rows);
    for (let i = 0; i < this.matrix.rows; i++) {
      roots[i] = this.matrix.get(i, this.matrix.cols - 1);
    }

    return {
      result: SolutionResultType.Unique,
      roots,
    };
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
