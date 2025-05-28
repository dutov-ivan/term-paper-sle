import { describe, it, expect } from "vitest";
import { JordanGaussMethod } from "./jordan-gauss-method";
import { SlaeMatrix } from "../math/slae-matrix";
import { SolutionResultEnum } from "../solution/solution-result-type";

class TestMatrix extends SlaeMatrix {
  data: number[][];
  constructor(data: number[][]) {
    super(data.length);
    this.data = data;
  }
  get(row: number, col: number) {
    return this.data[row][col];
  }
  set(row: number, col: number, value: number) {
    this.data[row][col] = value;
  }
  swapRows(r1: number, r2: number) {
    [this.data[r1], this.data[r2]] = [this.data[r2], this.data[r1]];
  }
}

describe("JordanGaussMethod", () => {
  it("returns unique solution for a regular system", () => {
    const matrixData = [
      [1, 1, 2],
      [1, -1, 0],
    ];
    const matrix = new TestMatrix(matrixData);
    const method = new JordanGaussMethod(matrix);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultEnum.Unique);
    expect(result.roots).toEqual([1, 1]);
  });

  it("returns infinite solutions for underdetermined system", () => {
    const matrixData = [
      [1, 1, 2],
      [2, 2, 4],
    ];
    const matrix = new TestMatrix(matrixData);
    const method = new JordanGaussMethod(matrix);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultEnum.Infinite);
    expect(result.description).toBeDefined();
  });

  it("returns no solution for inconsistent system", () => {
    const matrixData = [
      [1, 1, 2],
      [1, 1, 3],
    ];
    const matrix = new TestMatrix(matrixData);
    const method = new JordanGaussMethod(matrix);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultEnum.None);
    expect(result.description).toBeUndefined();
    expect(result.roots).toBeUndefined();
  });

  it("throws if matrix is not initialized", () => {
    // @ts-expect-error: intentionally passing null
    const method = new JordanGaussMethod(null);
    expect(() => Array.from(method.getForwardSteps())).toThrow(
      "Matrix not initialized"
    );
    expect(() => method.backSubstitute()).toThrow("Matrix not initialized");
  });

  it("handles zero matrix as infinite solutions", () => {
    const matrixData = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    const matrix = new TestMatrix(matrixData);
    const method = new JordanGaussMethod(matrix);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultEnum.Infinite);
  });

  /*
  it("produces correct steps for a 3x3 system", () => {
    const matrixData = [
      [1, 2, 3, 14],
      [2, 1, 1, 10],
      [3, 2, 1, 14],
    ];
    const matrix = new TestMatrix(matrixData.map((row) => [...row]));
    const method = new JordanGaussMethod(matrix);
    const steps = Array.from(method.getForwardSteps());
    const stepDescriptions = steps.map((step) => step.print());
    const expectedSteps = [
      "From 0 to 2 — StepSwapRows",
      "From 0 to 0 — StepScale",
      "From 0 to 1 — StepEliminate",
      "From 0 to 2 — StepEliminate",
      "From 1 to 2 — StepSwapRows",
      "From 1 to 1 — StepScale",
      "From 1 to 2 — StepEliminate",
      "From 2 to 2 — StepScale",
      "From 2 to 0 — StepEliminate",
      "From 2 to 1 — StepEliminate",
      "From 1 to 0 — StepEliminate",
    ];
    expect(matrix.data).toEqual([
      [1, 0, 0, 3],
      [0, 1, 0, 1],
      [0, 0, 1, 3],
    ]);
    expect(stepDescriptions).toEqual(expectedSteps);
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultEnum.Unique);
    expect(result.roots).toEqual([3, 1, 3]);
  });
  */
});
