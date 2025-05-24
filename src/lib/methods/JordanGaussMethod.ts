import Decimal from "decimal.js";
import type { DecimalMatrix } from "../math/DecimalMatrix";
import { isNearZero } from "../math/utils";
import type { Step } from "../steps/Step";
import { Method } from "./Method";
import type { SolutionResult } from "../solution/SolutionResult";
import { SolutionResultType } from "../solution/SolutionResultType";
import { StepEliminate } from "../steps/StepEliminate";
import { StepSwapRows } from "../steps/StepSwapRows";
import { StepScale } from "../steps/StepScale";

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
      const step = new StepSwapRows(sourceRow, pivotRow);
      step.perform(augmentedMatrix);
      this._elementaryOperations++;
      yield step;
    }
  }

  private *performScaling(augmentedMatrix: DecimalMatrix, sourceRow: number) {
    const step = new StepScale(sourceRow);
    if (!step.perform(augmentedMatrix)) {
      return;
    }
    this._elementaryOperations++;
    yield step;
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
      const eliminationStep = new StepEliminate(sourceRow, eliminationRow);
      if (!eliminationStep.perform(augmentedMatrix)) {
        continue;
      }
      this._elementaryOperations++;
      yield eliminationStep;
    }
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
