import type { DecimalMatrix } from "../math/DecimalMatrix";
import { Step } from "./Step";

export class StepSwapRows extends Step {
  constructor(sourceRow: number, targetRow: number) {
    super(sourceRow, targetRow);
  }

  perform(matrix: DecimalMatrix): boolean {
    matrix.swapRows(this.sourceRow, this.targetRow);
    return true;
  }

  performOnNumbers(matrix: number[][]): number[][] {
    const temp = matrix[this.sourceRow];
    matrix[this.sourceRow] = matrix[this.targetRow];
    matrix[this.targetRow] = temp;
    return matrix;
  }

  inverse(matrix: number[][]): number[][] {
    throw new Error("Method not implemented.");
  }
}
