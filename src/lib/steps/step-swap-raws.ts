import { Step } from "./step";
import type { Matrix } from "../math/Matrix";
import type { StepMetadata } from "./step-metadata";

export class StepSwapRows extends Step {
  toMetadata(): StepMetadata {
    return {
      type: "swap",
      sourceRow: this.sourceRow,
      targetRow: this.targetRow,
    };
  }
  constructor(sourceRow: number, targetRow: number) {
    super(sourceRow, targetRow);
  }

  iterations = 1;

  perform(matrix: Matrix): boolean {
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
    return this.performOnNumbers(matrix);
  }
}
