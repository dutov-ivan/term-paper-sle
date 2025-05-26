import { describe, it, expect, beforeEach } from "vitest";
import { JordanGaussMethod } from "./JordanGaussMethod";
import { SlaeMatrix } from "../math/slae-matrix";
import { SolutionResultType } from "../solution/SolutionResultType";

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
  let method: JordanGaussMethod;

  beforeEach(() => {
    method = new JordanGaussMethod();
  });

  it("returns unique solution for a regular system", () => {
    // x + y = 2, x - y = 0 => x=1, y=1
    const matrixData = [
      [1, 1, 2],
      [1, -1, 0],
    ];
    method.matrix = new TestMatrix(matrixData);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultType.Unique);
    expect(result.roots).toEqual([1, 1]);
  });

  it("returns infinite solutions for underdetermined system", () => {
    // x + y = 2, 2x + 2y = 4 (same equation)
    const matrixData = [
      [1, 1, 2],
      [2, 2, 4],
    ];
    method.matrix = new TestMatrix(matrixData);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultType.Infinite);
    expect(result.generalForm).toBeDefined();
  });

  it("returns no solution for inconsistent system", () => {
    // x + y = 2, x + y = 3 (contradiction)
    const matrixData = [
      [1, 1, 2],
      [1, 1, 3],
    ];
    method.matrix = new TestMatrix(matrixData);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultType.None);
    expect(result.generalForm).toBeUndefined();
    expect(result.roots).toBeUndefined();
  });

  it("throws if matrix is not initialized", () => {
    method.matrix = null;
    expect(() => Array.from(method.getForwardSteps())).toThrow();
    expect(() => method.backSubstitute()).toThrow();
  });

  it("handles zero matrix as infinite solutions", () => {
    const matrixData = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    method.matrix = new TestMatrix(matrixData);
    Array.from(method.getForwardSteps());
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultType.Infinite);
  });

  /*
  it("produces correct steps for a 3x3 system", () => {
    const matrixData = [
      [1, 2, 3, 14],
      [2, 1, 1, 10],
      [3, 2, 1, 14],
    ];
    console.log("Matrix contents before steps:");
    console.log(matrixData);
    method.matrix = new TestMatrix(matrixData.map((row) => [...row]));
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
    console.log(method.matrix.contents);
    expect(method.matrix.contents).toEqual([
      [1, 0, 0, 3],
      [0, 1, 0, 1],
      [0, 0, 1, 3],
    ]);
    expect(stepDescriptions).toEqual(expectedSteps);
    // Also check the solution is correct
    const result = method.backSubstitute();
    expect(result.result).toBe(SolutionResultType.Unique);
    expect(result.roots).toEqual([3, 1, 3]);
  });
  */
});
