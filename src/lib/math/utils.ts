import { maxPrecision } from "./constants";

const minJsValue = Math.pow(10, -maxPrecision);

export function isNearZero(
  value: number,
  epsilon: number = minJsValue
): boolean {
  return Math.abs(value) < epsilon;
}
