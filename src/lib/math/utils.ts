import { maxPrecision } from "./constants";

const minDecimalJsValue = 1 / Math.pow(10, maxPrecision);

export function isNearZero(
  value: number,
  epsilon: number = minDecimalJsValue
): boolean {
  return Math.abs(value) < epsilon;
}
