import { Matrix } from "./Matrix";
import { Decimal } from "decimal.js";

export class DecimalMatrix extends Matrix<Decimal> {
  toNumbers(): number[][] {
    return this.contents.map((row) => row.map((value) => value.toNumber()));
  }

  static fromNumbers(array: number[][]): DecimalMatrix {
    const decimalArray = array.map((row) =>
      row.map((value) => new Decimal(value.toFixed(15)))
    );
    return new DecimalMatrix(decimalArray);
  }
}
