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

  public static fromMatrix(matrix: Matrix): SlaeMatrix {
    if (matrix.rows === 0 || matrix.cols === 0) {
      throw new Error("Input matrix must not be empty");
    }
    if (matrix.cols !== matrix.rows + 1) {
      throw new Error("Input matrix must have one more column than rows");
    }

    const slaeMatrix = new SlaeMatrix(matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        slaeMatrix.set(i, j, matrix.get(i, j));
      }
    }

    return slaeMatrix;
  }

  static fromNumbers(array: number[][]): SlaeMatrix {
    if (array.length === 0 || array[0].length === 0) {
      throw new Error("Input array must not be empty");
    }
    if (array.some((row) => row.length !== array[0].length)) {
      throw new Error("All rows in the input array must have the same length");
    }

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
