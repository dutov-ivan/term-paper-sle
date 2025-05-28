import { Matrix } from "./Matrix";

export class SquareMatrix extends Matrix {
  private _size: number;
  public get size(): number {
    return this._size;
  }
  constructor(size: number) {
    super(size, size);
    this._size = size;
  }

  static identity(size: number): SquareMatrix {
    const identity = new SquareMatrix(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        identity.set(i, j, i === j ? 1 : 0);
      }
    }
    return identity;
  }
}
