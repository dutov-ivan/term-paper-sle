export class Matrix {
  public readonly rows: number;
  public readonly cols: number;
  public contents: number[][];

  constructor(height: number, width: number);
  constructor(data: number[][]);
  constructor(param1: number | number[][], param2?: number) {
    if (typeof param1 === "number" && typeof param2 === "number") {
      this.rows = param1;
      this.cols = param2;
      this.contents = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(0)
      );
    } else if (Array.isArray(param1)) {
      this.rows = param1.length;
      this.cols = this.rows === 0 ? 0 : param1[0].length;
      this.contents = param1.map((row) => row.map((value) => value));
    } else {
      throw new Error("Invalid constructor arguments");
    }
  }

  get(row: number, col: number): number {
    return this.contents[row][col];
  }

  set(x: number, y: number, value: number): void {
    this.contents[x][y] = value;
  }

  swapRows(fromRow: number, toRow: number): void {
    [this.contents[fromRow], this.contents[toRow]] = [
      this.contents[toRow],
      this.contents[fromRow],
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
    return this.contents.map((row) => row.map((value) => value));
  }
}

export function generateRandomMatrix(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size + 1 }, () => Math.floor(Math.random() * 100))
  );
}
