import { Matrix } from "../Matrix";
import type { Step } from "../steps/Step";
import type { IMethod } from "./IMethod";
import type { SolutionResult } from "../solution/SolutionResult";
import { SolutionResultType } from "../solution/SolutionResultType";
import { StepAction } from "../steps/StepAction";

// GaussMethod in TypeScript (logic ported from C#)
export class GaussMethod implements IMethod {
  private lastEchelonMatrix?: Matrix;

  *getForwardSteps(matrix: Matrix): IterableIterator<Step> {
    const augmentedMatrix = new Matrix(matrix.contents);
    this.lastEchelonMatrix = augmentedMatrix;

    for (let sourceRow = 0; sourceRow < augmentedMatrix.rows - 1; sourceRow++) {
      let pivotRow = sourceRow;
      for (let i = sourceRow + 1; i < augmentedMatrix.rows; i++) {
        if (
          Math.abs(augmentedMatrix.get(i, sourceRow)) >
          Math.abs(augmentedMatrix.get(pivotRow, sourceRow))
        ) {
          pivotRow = i;
        }
      }
      if (Math.abs(augmentedMatrix.get(pivotRow, sourceRow)) < 1e-12) {
        continue;
      }
      if (pivotRow !== sourceRow) {
        augmentedMatrix.swapRows(sourceRow, pivotRow);
        yield {
          sourceRow,
          targetRow: pivotRow,
          action: StepAction.SwapRows,
          coefficients: new Matrix(augmentedMatrix.contents),
        };
      }
      for (
        let eliminationRow = sourceRow + 1;
        eliminationRow < augmentedMatrix.rows;
        eliminationRow++
      ) {
        const pivot = augmentedMatrix.get(sourceRow, sourceRow);
        if (Math.abs(pivot) < 1e-12) continue;
        const mul = -augmentedMatrix.get(eliminationRow, sourceRow) / pivot;
        for (
          let columnIndex = sourceRow;
          columnIndex < augmentedMatrix.cols;
          columnIndex++
        ) {
          augmentedMatrix.set(
            eliminationRow,
            columnIndex,
            augmentedMatrix.get(eliminationRow, columnIndex) +
              mul * augmentedMatrix.get(sourceRow, columnIndex)
          );
        }
        yield {
          sourceRow,
          targetRow: eliminationRow,
          action: StepAction.Eliminate,
          coefficients: new Matrix(augmentedMatrix.contents),
        };
      }
    }
    this.lastEchelonMatrix = new Matrix(augmentedMatrix.contents);
  }

  backSubstitute(): SolutionResult {
    if (!this.lastEchelonMatrix) {
      throw new Error("Previous steps must be done for back substitution");
    }
    const matrix = this.lastEchelonMatrix;
    const solutionType = this.analyzeEchelonForm(matrix);
    if (solutionType !== SolutionResultType.Unique) {
      return {
        result: solutionType,
        generalForm:
          solutionType === SolutionResultType.Infinite
            ? "General solution exists"
            : undefined,
      };
    }
    const roots = new Array(matrix.rows);
    for (let row = matrix.rows - 1; row >= 0; row--) {
      const rhs = matrix.get(row, matrix.cols - 1);
      let sum = rhs;
      for (let col = row + 1; col < matrix.cols - 1; col++) {
        sum -= matrix.get(row, col) * roots[col];
      }
      const pivot = matrix.get(row, row);
      if (Math.abs(pivot) < 1e-12) {
        return { result: SolutionResultType.Infinite };
      }
      roots[row] = sum / pivot;
    }
    return { result: SolutionResultType.Unique, roots };
  }

  private analyzeEchelonForm(matrix: Matrix): SolutionResultType {
    const rows = matrix.rows;
    const cols = matrix.cols - 1;
    let rank = 0;
    for (let row = 0; row < rows; row++) {
      let allZero = true;
      for (let col = 0; col < cols; col++) {
        if (Math.abs(matrix.get(row, col)) > 1e-12) {
          allZero = false;
          break;
        }
      }
      const rhs = matrix.get(row, matrix.cols - 1);
      if (allZero && Math.abs(rhs) > 1e-12) {
        return SolutionResultType.None;
      }
      if (!allZero) {
        rank++;
      }
    }
    if (rank < cols) {
      return SolutionResultType.Infinite;
    }
    return SolutionResultType.Unique;
  }
}
