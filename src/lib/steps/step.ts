import type { Matrix } from "../math/Matrix";
import type { StepMetadata } from "./step-metadata";

export abstract class Step {
  constructor(sourceRow: number, targetRow: number) {
    this.sourceRow = sourceRow;
    this.targetRow = targetRow;
  }

  public iterations = 0;

  public sourceRow: number;
  public targetRow: number;

  abstract perform(matrix: Matrix): boolean;

  abstract inverse(matrix: number[][]): number[][];

  abstract toMetadata(): StepMetadata;
}
