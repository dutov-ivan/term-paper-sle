import type { SlaeMatrix } from "../math/slae-matrix";
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
  perform(matrix: SlaeMatrix): boolean {
    return this.eliminateRow(matrix);
  }

  private eliminateRow(augmentedMatrix: SlaeMatrix): boolean {
    const sourceRow = this.sourceRow;
    const targetRow = this.targetRow;
    const pivot = augmentedMatrix.get(sourceRow, sourceRow);
    if (isNearZero(Math.abs(pivot))) return false;

    const multiplier = -augmentedMatrix.get(targetRow, sourceRow) / pivot;
    this._multiplier = multiplier;

    for (let col = sourceRow; col < augmentedMatrix.cols; col++) {
      const value =
        augmentedMatrix.get(targetRow, col) +
        multiplier * augmentedMatrix.get(sourceRow, col);
      augmentedMatrix.set(targetRow, col, value);
    }
    console.log(
      `Eliminating row ${targetRow} using row ${sourceRow} with multiplier ${multiplier}`
    );

    augmentedMatrix.set(targetRow, sourceRow, 0);

    return true;
  }

  private _multiplier: number = 1;
  public get multiplier(): number {
    return this._multiplier;
  }

  constructor(sourceRow: number, targetRow: number) {
    super(sourceRow, targetRow);
  }

  inverse(matrix: number[][]): number[][] {
    const sourceRow = this.sourceRow;
    const targetRow = this.targetRow;
    const multiplier = this._multiplier;

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
