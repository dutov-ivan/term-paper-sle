import { Matrix } from "./Matrix";

export class SlaeMatrix extends Matrix<number> {
  private _size: number = this.rows;
  public get size(): number {
    return this._size;
  }
  constructor(size: number) {
    super(size, size + 1);
    this._size = size;
  }

  static fromNumbers(array: number[][]): SlaeMatrix {
    const matrix = new SlaeMatrix(array.length);
    matrix.contents = array;
    return matrix;
  }
}
