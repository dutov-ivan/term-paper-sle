import { describe, it, expect, beforeEach } from "vitest";
import { GaussMethod } from "./GaussMethod";
import { SolutionResultType } from "../solution/SolutionResultType";
import { isNearZero } from "../math/utils";
import { SlaeMatrix } from "../math/slae-matrix";
import { expectMatricesClose, runMatrixComplete } from "./common";

describe("GaussMethod", () => {
  let method: GaussMethod;

  beforeEach(() => {
    method = new GaussMethod();
  });

  describe("calculates everything properly", () => {
    it("should perform correct pivot swaps and eliminations", () => {
      const matrixData = [
        [0, 2, 1, 4],
        [3, 1, 5, 7],
        [1, 1, 1, 6],
      ];
      const steps = Array.from(method.run(SlaeMatrix.fromNumbers(matrixData)));
      const stepDescriptions = steps.map((step) => step.print());
      expect(stepDescriptions).toEqual([
        "Swap rows 0 and 1",
        "Eliminate row 1 using row 0",
        "Eliminate row 2 using row 0",
        "Eliminate row 2 using row 1",
      ]);
      expectMatricesClose(method.matrix!.contents, [
        [3, 1, 5, 7],
        [0, 2, 1, 4],
        [0, 0, -1, 2.33333333333],
      ]);
    });

    it("should skip pivot swap if pivot is in the right place", () => {
      const matrixData = [
        [5, 1, -1],
        [-3, -1, 2],
      ];

      const steps = Array.from(method.run(SlaeMatrix.fromNumbers(matrixData)));

      // No pivot swap in first step expected
      expect(
        steps.some((step) => step.constructor.name === "StepSwapRows")
      ).toBe(false);
    });
  });

  describe("back substitution", () => {
    it("should return unique solution for upper triangular matrix", () => {
      const matrixData = [
        [2, 3, 8],
        [0, 1, 2],
      ];
      method.matrix = SlaeMatrix.fromNumbers(matrixData);

      const result = method.backSubstitute();

      expect(result.result).toBe(SolutionResultType.Unique);
      expect(result.roots).toBeDefined();
      expect(result.roots).toEqual([1, 2]);
    });

    it("should throw on zero pivot during back substitution", () => {
      const matrixData = [
        [0, 1, 3],
        [0, 0, 2],
      ];
      method.matrix = SlaeMatrix.fromNumbers(matrixData);

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
      method.matrix = SlaeMatrix.fromNumbers(matrixData);

      const solutionType = (method as any).analyzeEchelonForm(method.matrix);
      expect(solutionType).toBe(SolutionResultType.Infinite);
    });

    it("should detect no solution for inconsistent system", () => {
      // Zero row but non-zero RHS (inconsistent)
      const matrixData = [
        [1, -2, 3],
        [0, 0, 5],
      ];
      method.matrix = SlaeMatrix.fromNumbers(matrixData);

      const solutionType = (method as any).analyzeEchelonForm(method.matrix);
      expect(solutionType).toBe(SolutionResultType.None);
    });

    it("should detect unique solution for full rank matrix", () => {
      const matrixData = [
        [1, 2, 3],
        [0, 1, 4],
      ];
      const steps = method.run(SlaeMatrix.fromNumbers(matrixData));

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
      method.matrix = SlaeMatrix.fromNumbers(matrixData);

      const steps = Array.from(method.getForwardSteps());
      // No swaps or elimination should be performed
      expect(steps.length).toBe(0);

      const solutionType = (method as any).analyzeEchelonForm(method.matrix);
      expect(solutionType).toBe(SolutionResultType.Infinite);
    });
  });
});
