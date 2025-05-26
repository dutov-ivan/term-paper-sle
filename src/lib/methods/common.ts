import { expect } from "vitest";
import type { SlaeMatrix } from "../math/slae-matrix";
import type { IMethod } from "./IMethod";

export const runMatrixComplete = (
  method: IMethod,
  matrix: SlaeMatrix
): number[][] => {
  const stepIterator = method.run(matrix);
  for (const _ of stepIterator) {
    continue;
  }

  return matrix.contents;
};

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
