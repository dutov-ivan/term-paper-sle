import type { SlaeMatrix } from "../math/slae-matrix";
import type { StepMetadata } from "./StepMetadata";

export abstract class Step {
  constructor(sourceRow: number, targetRow: number) {
    this.sourceRow = sourceRow;
    this.targetRow = targetRow;
  }

  public sourceRow: number;
  public targetRow: number;

  abstract perform(matrix: SlaeMatrix): boolean;

  abstract inverse(matrix: number[][]): number[][];

  abstract toMetadata(): StepMetadata;
}
