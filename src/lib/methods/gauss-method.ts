import type { SolutionResult } from "../solution/solution-result";
import {
  SolutionResultEnum,
  type SolutionResultType,
} from "../solution/solution-result-type";
import { Method } from "./Method";
import { isNearZero } from "../math/utils";
import { StepSwapRows } from "../steps/step-swap-raws";
import { StepEliminate } from "../steps/step-eliminate";
import { SlaeMatrix } from "../math/slae-matrix";
import type { Step } from "../steps/step";

export class GaussMethod extends Method {
  *getForwardSteps(): IterableIterator<Step> {
    if (!this.matrix) {
      throw new Error("Matrix not initialized");
    }
    const augmentedMatrix = this.matrix;

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
      const step = new StepSwapRows(sourceRow, pivotRow);
      step.perform(augmentedMatrix);
      this.methodMetadata.elementaryOperations++;
      this.methodMetadata.iterations += step.iterations;
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
      this.methodMetadata.elementaryOperations++;
      this.methodMetadata.iterations += step.iterations;
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
      this.methodMetadata.iterations++;
    }
    return pivotRow;
  }

  backSubstitute(): SolutionResult {
    if (!this.matrix) {
      throw new Error("Matrix not initialized");
    }

    const solutionType = this.analyzeEchelonForm(this.matrix);
    if (solutionType !== SolutionResultEnum.Unique) {
      return {
        result: solutionType,
        description:
          solutionType === SolutionResultEnum.Infinite
            ? "General solution exists"
            : undefined,
      };
    }

    const roots = this.solveUpperTriangular(this.matrix);
    return {
      result: SolutionResultEnum.Unique,
      roots: roots,
    };
  }

  private analyzeEchelonForm(matrix: SlaeMatrix): SolutionResultType {
    let rank = 0;
    const rows = matrix.rows;
    const cols = matrix.cols - 1;

    for (let row = 0; row < rows; row++) {
      const isZeroRow = matrix.isZeroRowCoefficients(row);
      this.methodMetadata.backSubstitutionOperations += cols;
      const rhs = matrix.get(row, matrix.cols - 1);

      if (isZeroRow && !isNearZero(rhs)) return SolutionResultEnum.None;
      if (!isZeroRow) rank++;
    }

    return rank < cols
      ? SolutionResultEnum.Infinite
      : SolutionResultEnum.Unique;
  }

  private solveUpperTriangular(matrix: SlaeMatrix): number[] {
    const roots = new Array<number>(matrix.rows);

    for (let row = matrix.rows - 1; row >= 0; row--) {
      let rhs = matrix.get(row, matrix.cols - 1);

      for (let col = row + 1; col < matrix.cols - 1; col++) {
        const coeff = matrix.get(row, col);
        rhs -= coeff * roots[col];
        this.methodMetadata.backSubstitutionOperations++;
      }

      const pivot = matrix.get(row, row);
      if (isNearZero(pivot)) {
        throw new Error("Unexpected zero pivot during back-substitution");
      }

      roots[row] = rhs / pivot;
    }

    return roots;
  }
}
