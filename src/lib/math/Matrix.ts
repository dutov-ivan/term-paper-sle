// Matrix model in TypeScript
export class Matrix<T> {
  public readonly rows: number;
  public readonly cols: number;
  public contents: T[][];

  constructor(height: number, width: number);
  constructor(data: T[][]);
  constructor(param1: number | T[][], param2?: number) {
    if (typeof param1 === "number" && typeof param2 === "number") {
      this.rows = param1;
      this.cols = param2;
      this.contents = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(0)
      );
    } else if (Array.isArray(param1)) {
      this.rows = param1.length;
      this.cols = this.rows === 0 ? 0 : param1[0].length;
      this.contents = param1;
    } else {
      throw new Error("Invalid constructor arguments");
    }
  }

  get(row: number, col: number): T {
    return this.contents[row][col];
  }

  set(x: number, y: number, value: T): void {
    this.contents[x][y] = value;
  }

  swapRows(fromRow: number, toRow: number): void {
    [this.contents[fromRow], this.contents[toRow]] = [
      this.contents[toRow],
      this.contents[fromRow],
    ];
  }
}
