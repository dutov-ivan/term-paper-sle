import type { DecimalMatrix } from "../math/DecimalMatrix";
import { isNearZero } from "../math/utils";
import { Step } from "./Step";

export class StepScale extends Step {
  perform(matrix: DecimalMatrix): boolean {
    const sourceRow = this.sourceRow;
    const pivot = matrix.get(sourceRow, sourceRow);
    if (isNearZero(pivot.abs())) return false;
    for (
      let columnIndex = sourceRow;
      columnIndex < matrix.cols;
      columnIndex++
    ) {
      matrix.set(
        sourceRow,
        columnIndex,
        matrix.get(sourceRow, columnIndex).div(pivot)
      );
    }
    return true;
  }

  constructor(sourceRow: number) {
    super(sourceRow, sourceRow);
  }

  inverse(matrix: number[][]): number[][] {
    throw new Error("Method not implemented.");
  }
}
