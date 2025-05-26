import type { SlaeMatrix } from "../math/slae-matrix";
import { isNearZero } from "../math/utils";
import { Step } from "./Step";
import type { StepMetadata } from "./StepMetadata";

export class StepScale extends Step {
  toMetadata(): StepMetadata {
    return {
      type: "scale",
      sourceRow: this.sourceRow,
      targetRow: this.targetRow,
      multiplier: this.multiplier,
    };
  }
  multiplier: number = 1;

  perform(matrix: SlaeMatrix): boolean {
    const sourceRow = this.sourceRow;
    const pivot = matrix.get(sourceRow, sourceRow);
    this.multiplier = pivot;
    if (isNearZero(Math.abs(pivot))) return false;
    for (
      let columnIndex = sourceRow;
      columnIndex < matrix.cols;
      columnIndex++
    ) {
      matrix.set(
        sourceRow,
        columnIndex,
        matrix.get(sourceRow, columnIndex) / pivot
      );
    }
    return true;
  }

  constructor(sourceRow: number) {
    super(sourceRow, sourceRow);
  }

  inverse(matrix: number[][]): number[][] {
    for (let col = 0; col < matrix[0].length; col++) {
      matrix[this.sourceRow][col] *= this.multiplier;
    }
    return matrix;
  }
}
