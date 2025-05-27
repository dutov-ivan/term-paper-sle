import { Matrix } from "./Matrix";
import { SquareMatrix } from "./SquareMatrix";

export class SlaeMatrix extends Matrix {
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
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        matrix.set(i, j, array[i][j]);
      }
    }
    return matrix;
  }

  public toSquareMatrix(): SquareMatrix {
    const squareMatrix = new SquareMatrix(this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols - 1; j++) {
        squareMatrix.set(i, j, this.get(i, j));
      }
    }
    return squareMatrix;
  }
}
