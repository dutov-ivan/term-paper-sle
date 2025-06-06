import type { Matrix } from "../math/Matrix";
import { isNearZero } from "../math/utils";
import type { Step } from "../steps/step";
import { StepEliminate } from "../steps/step-eliminate";
import { StepScaleAfterPivot } from "../steps/step-scale";
import { StepSwapRows } from "../steps/step-swap-raws";
import type { MethodMetadata } from "./Method";

export class JordanGaussStepper {
  public matrix: Matrix;
  public metadata: MethodMetadata;

  constructor(matrix: Matrix, metadata: MethodMetadata) {
    this.matrix = matrix;
    this.metadata = metadata;
  }

  *getForwardSteps(): IterableIterator<Step> {
    if (!this.matrix) {
      throw new Error("Matrix not initialized");
    }
    const augmentedMatrix = this.matrix;

    for (let sourceRow = 0; sourceRow < augmentedMatrix.rows - 1; sourceRow++) {
      yield* this.performPivotSwap(augmentedMatrix, sourceRow);
      yield* this.performScaling(augmentedMatrix, sourceRow);
      yield* this.performRowElimination(augmentedMatrix, sourceRow, "down");
    }

    yield* this.performScaling(augmentedMatrix, augmentedMatrix.rows - 1);

    for (
      let sourceRow = augmentedMatrix.rows - 1;
      sourceRow >= 0;
      sourceRow--
    ) {
      yield* this.performRowElimination(augmentedMatrix, sourceRow, "up");
    }
  }

  private *performPivotSwap(augmentedMatrix: Matrix, sourceRow: number) {
    const pivotRow = this.findPivotRow(augmentedMatrix, sourceRow);
    if (isNearZero(augmentedMatrix.get(pivotRow, sourceRow))) {
      return;
    }
    if (pivotRow !== sourceRow) {
      const step = new StepSwapRows(sourceRow, pivotRow);
      step.perform(augmentedMatrix);
      this.metadata.elementaryOperations++;
      this.metadata.iterations += step.iterations;
      yield step;
    }
  }

  private *performScaling(augmentedMatrix: Matrix, sourceRow: number) {
    const step = new StepScaleAfterPivot(sourceRow);
    if (step.perform(augmentedMatrix, true)) {
      this.metadata.elementaryOperations++;
      this.metadata.iterations += step.iterations;
      yield step;
    }
  }

  private *performRowElimination(
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
      this.metadata.iterations += step.iterations;
      this.metadata.elementaryOperations++;
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
