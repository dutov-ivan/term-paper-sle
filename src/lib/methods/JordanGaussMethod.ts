import Decimal from "decimal.js";
import type { DecimalMatrix } from "../math/DecimalMatrix";
import { isNearZero } from "../math/utils";
import type { Step } from "../steps/Step";
import { StepAction } from "../steps/StepAction";
import { Method } from "./Method";
import type { SolutionResult } from "../solution/SolutionResult";
import { SolutionResultType } from "../solution/SolutionResultType";

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

  private *performPivotSwap(augmentedMatrix: DecimalMatrix, sourceRow: number) {
    const pivotRow = this.findPivotRow(augmentedMatrix, sourceRow);
    if (isNearZero(augmentedMatrix.get(pivotRow, sourceRow).abs())) {
      return;
    }
    if (pivotRow !== sourceRow) {
      augmentedMatrix.swapRows(sourceRow, pivotRow);
      yield {
        sourceRow: sourceRow,
        targetRow: pivotRow,
        action: StepAction.SwapRows,
        coefficients: augmentedMatrix.toNumbers(),
      };
    }
  }

  private *performScaling(augmentedMatrix: DecimalMatrix, sourceRow: number) {
    const pivot = augmentedMatrix.get(sourceRow, sourceRow);
    if (isNearZero(pivot.abs())) return;
    for (
      let columnIndex = sourceRow;
      columnIndex < augmentedMatrix.cols;
      columnIndex++
    ) {
      augmentedMatrix.set(
        sourceRow,
        columnIndex,
        augmentedMatrix.get(sourceRow, columnIndex).div(pivot)
      );
    }
    yield {
      sourceRow: sourceRow,
      targetRow: sourceRow,
      action: StepAction.Scale,
      coefficients: augmentedMatrix.toNumbers(),
    };
  }

  private *performElimination(
    augmentedMatrix: DecimalMatrix,
    sourceRow: number,
    direction: "up" | "down"
  ) {
    const start = direction === "down" ? sourceRow + 1 : sourceRow - 1;
    const end = direction === "down" ? augmentedMatrix.rows : -1;
    const step = direction === "down" ? 1 : -1;

    for (
      let eliminationRow = start;
      eliminationRow !== end;
      eliminationRow += step
    ) {
      if (!this.eliminateRow(augmentedMatrix, sourceRow, eliminationRow)) {
        return;
      }
      yield {
        sourceRow: sourceRow,
        targetRow: eliminationRow,
        action: StepAction.Eliminate,
        coefficients: augmentedMatrix.toNumbers(),
      };
    }
  }

  private eliminateRow(
    augmentedMatrix: DecimalMatrix,
    sourceRow: number,
    targetRow: number
  ): boolean {
    const pivot = augmentedMatrix.get(sourceRow, sourceRow);
    if (isNearZero(pivot.abs())) return false;

    const multiplier = augmentedMatrix
      .get(targetRow, sourceRow)
      .div(pivot)
      .negated();

    for (let col = sourceRow; col < augmentedMatrix.cols; col++) {
      const value = augmentedMatrix
        .get(targetRow, col)
        .add(multiplier.mul(augmentedMatrix.get(sourceRow, col)));
      augmentedMatrix.set(targetRow, col, value);
    }

    augmentedMatrix.set(targetRow, sourceRow, new Decimal(0));

    return true;
  }

  private findPivotRow(augmentedMatrix: DecimalMatrix, sourceRow: number) {
    let pivotRow = sourceRow;
    for (let i = sourceRow + 1; i < augmentedMatrix.rows; i++) {
      if (
        augmentedMatrix
          .get(i, sourceRow)
          .abs()
          .greaterThan(augmentedMatrix.get(pivotRow, sourceRow).abs())
      ) {
        pivotRow = i;
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
      roots[i] = this.matrix.get(i, this.matrix.cols - 1).toNumber();
    }

    return {
      result: SolutionResultType.Unique,
      roots,
    };
  }

  private analyzeEchelonForm(matrix: DecimalMatrix): SolutionResultType {
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

  private isZeroRow(matrix: DecimalMatrix, row: number, cols: number): boolean {
    for (let col = 0; col < cols; col++) {
      if (!isNearZero(matrix.get(row, col))) return false;
    }
    return true;
  }
}
