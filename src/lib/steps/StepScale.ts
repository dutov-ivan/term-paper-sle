import type { SlaeMatrix } from "../math/slae-matrix";
import { isNearZero } from "../math/utils";
import { Step } from "./Step";

export class StepScale extends Step {
  perform(matrix: SlaeMatrix): boolean {
    const sourceRow = this.sourceRow;
    const pivot = matrix.get(sourceRow, sourceRow);
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

  inverse(_: number[][]): number[][] {
    throw new Error("Method not implemented.");
  }
}
