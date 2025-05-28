export const MAX_BEFORE_DOT = 6;
export const MAX_AFTER_DOT = 6;

const minJsValue = Math.pow(10, -MAX_AFTER_DOT);

export function isNearZero(
  value: number,
  epsilon: number = minJsValue
): boolean {
  return Math.abs(value) < epsilon;
}

export function displayNumber(value: number): string {
  if (isNearZero(value)) return "0";

  const roundedValue = Number(value.toFixed(MAX_AFTER_DOT));
  return roundedValue.toString();
}
