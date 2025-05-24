import Decimal from "decimal.js";
import type { DecimalMatrix } from "../math/DecimalMatrix";
import { isNearZero } from "../math/utils";
import { Step } from "./Step";

export class StepEliminate extends Step {
  perform(matrix: DecimalMatrix): boolean {
    return this.eliminateRow(matrix);
  }

  private eliminateRow(augmentedMatrix: DecimalMatrix): boolean {
    const sourceRow = this.sourceRow;
    const targetRow = this.targetRow;
    const pivot = augmentedMatrix.get(sourceRow, sourceRow);
    if (isNearZero(pivot.abs())) return false;

    const multiplier = augmentedMatrix
      .get(targetRow, sourceRow)
      .div(pivot)
      .negated();

    this._multiplier = multiplier.toNumber();

    for (let col = sourceRow; col < augmentedMatrix.cols; col++) {
      const value = augmentedMatrix
        .get(targetRow, col)
        .add(multiplier.mul(augmentedMatrix.get(sourceRow, col)));
      augmentedMatrix.set(targetRow, col, value);
    }

    augmentedMatrix.set(targetRow, sourceRow, new Decimal(0));

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
    throw new Error("Method not implemented.");
  }
}
