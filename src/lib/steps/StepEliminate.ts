import type { SlaeMatrix } from "../math/slae-matrix";
import { isNearZero } from "../math/utils";
import { Step } from "./Step";

export class StepEliminate extends Step {
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

  inverse(_: number[][]): number[][] {
    throw new Error("Method not implemented.");
  }
}
