import { describe, it, expect, beforeEach } from "vitest";
import { GaussMethod } from "./GaussMethod";
import { SlaeMatrix } from "../math/slae-matrix";
import { SolutionResultType } from "../solution/SolutionResultType";
import { isNearZero } from "../math/utils";

// Mocks or stubs if needed
// (Adjust or replace with real implementations if available)
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

describe("GaussMethod", () => {
  let method: GaussMethod;

  beforeEach(() => {
    method = new GaussMethod();
  });

  describe("forward elimination steps", () => {
    it("should perform correct pivot swaps and eliminations", () => {
      // Matrix with known pivot swaps needed
      // 3x4 matrix (3 eqs, 3 vars + RHS)
      // Example system:
      // 0 2 1 | 4
      // 3 1 5 | 7
      // 1 1 1 | 6
      const matrixData = [
        [0, 2, 1, 4],
        [3, 1, 5, 7],
        [1, 1, 1, 6],
      ];
      method.matrix = new TestMatrix(matrixData);

      const steps = Array.from(method.getForwardSteps());

      // Expect first step is swap row 0 and 1 because pivot 0,0 is zero
      const firstStep = steps[0];
      expect(firstStep.constructor.name).toBe("StepSwapRows");
      expect(firstStep).toHaveProperty("sourceRow", 0);
      expect(firstStep).toHaveProperty("targetRow", 1);

      // Check that after pivot swap matrix[0][0] != 0
      expect(isNearZero(method.matrix.get(0, 0))).toBe(false);

      // Elimination steps count should be >= 1 (rows below eliminated)
      const eliminationSteps = steps.filter(
        (step) => step.constructor.name === "StepEliminate"
      );
      expect(eliminationSteps.length).toBeGreaterThan(0);

      // Check matrix shape after elimination remains consistent
      expect(method.matrix.rows).toBe(3);
      expect(method.matrix.cols).toBe(4);
    });

    it("should skip pivot swap if pivot is in the right place", () => {
      const matrixData = [
        [5, 1, -1],
        [-3, -1, 2],
      ];
      method.matrix = new TestMatrix(matrixData);

      const steps = Array.from(method.getForwardSteps());

      // No pivot swap in first step expected
      expect(
        steps.some((step) => step.constructor.name === "StepSwapRows")
      ).toBe(false);
    });
  });

  describe("back substitution", () => {
    it("should return unique solution for upper triangular matrix", () => {
      // Upper triangular matrix representing system:
      // 2x + 3y = 8
      // 0  y = 2
      const matrixData = [
        [2, 3, 8],
        [0, 1, 2],
      ];
      method.matrix = new TestMatrix(matrixData);

      const result = method.backSubstitute();

      expect(result.result).toBe(SolutionResultType.Unique);
      expect(result.roots).toBeDefined();
      // x and y values
      // y = 2
      // 2x + 3*2 = 8 => 2x=2 => x=1
      expect(result.roots).toEqual([1, 2]);
    });

    it("should throw on zero pivot during back substitution", () => {
      const matrixData = [
        [0, 1, 3],
        [0, 0, 2],
      ];
      method.matrix = new TestMatrix(matrixData);

      const step = method.backSubstitute();
      expect(step.result).toBe(SolutionResultType.None);
      expect(step.roots).toBeUndefined();
      expect(step.generalForm).toBeUndefined();
    });
  });

  describe("solution type analysis", () => {
    it("should detect infinite solutions for rank deficient matrix", () => {
      // Matrix with zero row and zero RHS (free variables)
      const matrixData = [
        [1, 2, 3],
        [0, 0, 0],
      ];
      method.matrix = new TestMatrix(matrixData);

      const solutionType = (method as any).analyzeEchelonForm(method.matrix);
      expect(solutionType).toBe(SolutionResultType.Infinite);
    });

    it("should detect no solution for inconsistent system", () => {
      // Zero row but non-zero RHS (inconsistent)
      const matrixData = [
        [1, -2, 3],
        [0, 0, 5],
      ];
      method.matrix = new TestMatrix(matrixData);

      const solutionType = (method as any).analyzeEchelonForm(method.matrix);
      expect(solutionType).toBe(SolutionResultType.None);
    });

    it("should detect unique solution for full rank matrix", () => {
      const matrixData = [
        [1, 2, 3],
        [0, 1, 4],
      ];
      method.matrix = new TestMatrix(matrixData);

      const solutionType = (method as any).analyzeEchelonForm(method.matrix);
      expect(solutionType).toBe(SolutionResultType.Unique);
    });
  });

  describe("edge cases", () => {
    it("should throw error if matrix not initialized", () => {
      method.matrix = null;
      expect(() => Array.from(method.getForwardSteps())).toThrow(
        /Matrix not initialized/
      );
      expect(() => method.backSubstitute()).toThrow(/Matrix not initialized/);
    });

    it("should handle zero matrix", () => {
      const matrixData = [
        [0, 0, 0],
        [0, 0, 0],
      ];
      method.matrix = new TestMatrix(matrixData);

      const steps = Array.from(method.getForwardSteps());
      // No swaps or elimination should be performed
      expect(steps.length).toBe(0);

      const solutionType = (method as any).analyzeEchelonForm(method.matrix);
      expect(solutionType).toBe(SolutionResultType.Infinite);
    });
  });
});
