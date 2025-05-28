import { expect } from "vitest";
export function expectMatricesClose(
  actual: number[][],
  expected: number[][],
  precision = 10
) {
  expect(actual.length).toBe(expected.length);
  for (let i = 0; i < actual.length; i++) {
    expect(actual[i].length).toBe(expected[i].length);
    for (let j = 0; j < actual[i].length; j++) {
      expect(actual[i][j]).toBeCloseTo(expected[i][j], precision);
    }
  }
}
