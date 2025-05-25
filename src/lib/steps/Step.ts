import type { SlaeMatrix } from "../math/slae-matrix";

export abstract class Step {
  constructor(sourceRow: number, targetRow: number) {
    this.sourceRow = sourceRow;
    this.targetRow = targetRow;
  }

  protected sourceRow: number;
  protected targetRow: number;
  abstract perform(matrix: SlaeMatrix): boolean;

  abstract inverse(matrix: number[][]): number[][];
  print(): string {
    return `From ${this.sourceRow} to ${this.targetRow} — ${this.constructor.name}`;
  }
}
