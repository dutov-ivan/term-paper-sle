import type { Matrix } from "../math/Matrix";
import { isNearZero } from "../math/utils";
import { Step } from "./Step";
import type { StepMetadata } from "./StepMetadata";

export class StepEliminate extends Step {
  toMetadata(): StepMetadata {
    return {
      type: "eliminate",
      sourceRow: this.sourceRow,
      targetRow: this.targetRow,
      multiplier: this._multiplier,
    };
  }
  perform(matrix: Matrix, isStartingFromBeginning: boolean = true): boolean {
    return this.eliminateRow(matrix, isStartingFromBeginning);
  }

  private eliminateRow(
    augmentedMatrix: Matrix,
    isStartingFromBeginning: boolean = true
  ): boolean {
    const sourceRow = this.sourceRow;
    const targetRow = this.targetRow;
    const pivot = augmentedMatrix.get(sourceRow, sourceRow);

    if (this._multiplier === undefined) {
      if (isNearZero(pivot)) return false;
      this._multiplier = -augmentedMatrix.get(targetRow, sourceRow) / pivot;
    }

    for (
      let col = isStartingFromBeginning ? 0 : sourceRow;
      col < augmentedMatrix.cols;
      col++
    ) {
      const value =
        augmentedMatrix.get(targetRow, col) +
        this._multiplier * augmentedMatrix.get(sourceRow, col);
      augmentedMatrix.set(targetRow, col, value);
    }

    return true;
  }

  private _multiplier?: number;
  public get multiplier(): number | undefined {
    return this._multiplier;
  }

  constructor(sourceRow: number, targetRow: number) {
    super(sourceRow, targetRow);
  }

  inverse(matrix: number[][]): number[][] {
    const sourceRow = this.sourceRow;
    const targetRow = this.targetRow;
    const multiplier = this._multiplier!;

    if (
      sourceRow < 0 ||
      targetRow < 0 ||
      sourceRow >= matrix.length ||
      targetRow >= matrix.length
    ) {
      throw new Error("Invalid row indices for inverse operation.");
    }

    const numCols = matrix[0].length;

    const result = matrix.map((row) => [...row]);

    for (let col = 0; col < numCols; col++) {
      result[targetRow][col] -= multiplier * result[sourceRow][col];
    }

    return result;
  }
}
