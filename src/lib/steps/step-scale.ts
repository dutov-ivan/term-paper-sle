import type { Matrix } from "../math/Matrix";
import { isNearZero } from "../math/utils";
import { Step } from "./step";
import type { StepMetadata } from "./step-metadata";

export class StepScaleAfterPivot extends Step {
  toMetadata(): StepMetadata {
    return {
      type: "scale",
      sourceRow: this.sourceRow,
      targetRow: this.targetRow,
      multiplier: this._multiplier,
    };
  }

  private _multiplier?: number;

  perform(matrix: Matrix, isStartingFromSource: boolean = false): boolean {
    const sourceRow = this.sourceRow;
    const pivot = matrix.get(sourceRow, sourceRow);

    if (this._multiplier === undefined) {
      if (isNearZero(pivot)) return false;
      this._multiplier = 1 / pivot;
    }
    if (isNearZero(this._multiplier)) return false;
    for (
      let columnIndex = isStartingFromSource ? sourceRow : 0;
      columnIndex < matrix.cols;
      columnIndex++
    ) {
      matrix.set(
        sourceRow,
        columnIndex,
        matrix.get(sourceRow, columnIndex) * this._multiplier!
      );
      this.iterations++;
    }
    return true;
  }

  constructor(sourceRow: number) {
    super(sourceRow, sourceRow);
  }

  inverse(matrix: number[][]): number[][] {
    for (let col = 0; col < matrix[0].length; col++) {
      matrix[this.sourceRow][col] =
        matrix[this.sourceRow][col] * this._multiplier!;
    }
    return matrix;
  }
}
