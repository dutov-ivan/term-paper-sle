import { isNearZero } from "./utils";

export class Matrix {
  public readonly rows: number;
  public readonly cols: number;
  private _contents: number[][];

  public get contents(): number[][] {
    return this._contents;
  }

  public set contents(value: number[][]) {
    this._contents = value.map((row) => row.map((v) => v));
  }

  constructor(height: number, width: number);
  constructor(data: number[][]);
  constructor(param1: number | number[][], param2?: number) {
    if (typeof param1 === "number" && typeof param2 === "number") {
      this.rows = param1;
      this.cols = param2;
      this._contents = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(0)
      );
    } else if (Array.isArray(param1)) {
      this.rows = param1.length;
      this.cols = this.rows === 0 ? 0 : param1[0].length;
      this._contents = param1.map((row) => row.map((value) => value));
    } else {
      throw new Error("Invalid constructor arguments");
    }
  }

  get(row: number, col: number): number {
    return this._contents[row][col];
  }

  set(row: number, col: number, value: number): void {
    this._contents[row][col] = value;
  }

  swapRows(fromRow: number, toRow: number): void {
    [this._contents[fromRow], this._contents[toRow]] = [
      this._contents[toRow],
      this._contents[fromRow],
    ];
  }

  multiplyByVector(vector: number[]): number[] {
    if (this.cols !== vector.length) {
      throw new Error("Incompatible matrix and vector dimensions");
    }
    const result: number[] = Array(this.rows).fill(0);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result[i] += this.get(i, j) * vector[j];
      }
    }
    return result;
  }

  toArray(): number[][] {
    return this._contents.map((row) => row.map((value) => value));
  }

  public isZeroRowCoefficients(row: number): boolean {
    for (let col = 0; col < this.cols - 1; col++) {
      if (!isNearZero(this.get(row, col))) return false;
    }
    return true;
  }
}
