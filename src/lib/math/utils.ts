import Decimal from "decimal.js";
import { maxPrecision } from "./constants";

const minDecimalJsValue = new Decimal(1).div(new Decimal(10).pow(maxPrecision));

export function isNearZero(
  value: Decimal,
  epsilon: Decimal = minDecimalJsValue
): boolean {
  return value.abs().lessThan(epsilon);
}
