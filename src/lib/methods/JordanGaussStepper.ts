import type { Matrix } from "../math/Matrix";
import { isNearZero } from "../math/utils";
import type { Step } from "../steps/Step";
import { StepEliminate } from "../steps/StepEliminate";
import { StepScaleAfterPivot } from "../steps/StepScale";
import { StepSwapRows } from "../steps/StepSwapRows";

export class JordanGaussStepper {
  private _matrix: Matrix;
  private _elementaryOperations: number = 0;
  public get elementaryOperations(): number {
    return this._elementaryOperations;
  }

  public get matrix(): Matrix {
    return this._matrix;
  }

  constructor(matrix: Matrix) {
    this._matrix = matrix;
  }

  *getForwardSteps(): IterableIterator<Step> {
    if (!this._matrix) {
      throw new Error("Matrix not initialized");
    }
    const augmentedMatrix = this._matrix;

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

  private *performPivotSwap(augmentedMatrix: Matrix, sourceRow: number) {
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

  private *performScaling(augmentedMatrix: Matrix, sourceRow: number) {
    const step = new StepScaleAfterPivot(sourceRow);
    if (step.perform(augmentedMatrix, true)) {
      this._elementaryOperations++;
      yield step;
    }
  }

  private *performElimination(
    augmentedMatrix: Matrix,
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
      if (!step.perform(augmentedMatrix, false)) {
        continue;
      }
      this._elementaryOperations++;
      yield step;
    }
  }

  private findPivotRow(augmentedMatrix: Matrix, sourceRow: number) {
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
}
