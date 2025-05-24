import { Matrix } from "./Matrix";
import { Decimal } from "decimal.js";

export class DecimalMatrix extends Matrix<Decimal> {
  toNumbers(): string[][] {
    return this.contents.map((row) => row.map((value) => value.toString()));
  }

  static fromNumbers(array: string[][]): DecimalMatrix {
    const decimalArray = array.map((row) =>
      row.map((value) => new Decimal(value))
    );
    return new DecimalMatrix(decimalArray);
  }
}
