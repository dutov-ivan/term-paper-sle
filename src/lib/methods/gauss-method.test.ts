import { describe, it, expect, beforeEach } from "vitest";
import { GaussMethod } from "./GaussMethod";
import { SolutionResultType } from "../solution/SolutionResultType";
import { SlaeMatrix } from "../math/slae-matrix";
import { expectMatricesClose } from "./common";

describe("GaussMethod", () => {
  let matrix: SlaeMatrix;
  let method: GaussMethod;

  beforeEach(() => {
    // Ініціалізується у кожному тесті заново
  });

  describe("calculates everything properly", () => {
    it("should perform correct pivot swaps and eliminations", () => {
      matrix = SlaeMatrix.fromNumbers([
        [0, 2, 1, 4],
        [3, 1, 5, 7],
        [1, 1, 1, 6],
      ]);
      method = new GaussMethod(matrix);
      const steps = Array.from(method.getForwardSteps());
      const stepDescriptions = steps.map((step) => step.toMetadata());
      expect(stepDescriptions).toEqual([
        { type: "swap", sourceRow: 0, targetRow: 1 },
        {
          type: "eliminate",
          sourceRow: 0,
          targetRow: 1,
          multiplier: -0,
        },
        {
          type: "eliminate",
          sourceRow: 0,
          targetRow: 2,
          multiplier: -0.3333333333333333,
        },
        {
          type: "eliminate",
          sourceRow: 1,
          targetRow: 2,
          multiplier: -0.33333333333333337,
        },
      ]);
      expectMatricesClose(method._matrix.contents, [
        [3, 1, 5, 7],
        [0, 2, 1, 4],
        [0, 0, -1, 2.33333333333],
      ]);
    });

    it("should skip pivot swap if pivot is in the right place", () => {
      matrix = SlaeMatrix.fromNumbers([
        [5, 1, -1],
        [-3, -1, 2],
      ]);
      method = new GaussMethod(matrix);
      const steps = Array.from(method.getForwardSteps());
      expect(
        steps.some((step) => step.constructor.name === "StepSwapRows")
      ).toBe(false);
    });
  });

  describe("back substitution", () => {
    it("should return unique solution for upper triangular matrix", () => {
      matrix = SlaeMatrix.fromNumbers([
        [2, 3, 8],
        [0, 1, 2],
      ]);
      method = new GaussMethod(matrix);

      const result = method.backSubstitute();
      expect(result.result).toBe(SolutionResultType.Unique);
      expect(result.roots).toEqual([1, 2]);
    });

    it("should return no solution for inconsistent system", () => {
      matrix = SlaeMatrix.fromNumbers([
        [0, 1, 3],
        [0, 0, 2],
      ]);
      method = new GaussMethod(matrix);

      const result = method.backSubstitute();
      expect(result.result).toBe(SolutionResultType.None);
    });
  });

  describe("solution type analysis", () => {
    it("should detect infinite solutions for rank deficient matrix", () => {
      matrix = SlaeMatrix.fromNumbers([
        [1, 2, 3],
        [0, 0, 0],
      ]);
      method = new GaussMethod(matrix);

      const solutionType = (method as any).analyzeEchelonForm(method._matrix);
      expect(solutionType).toBe(SolutionResultType.Infinite);
    });

    it("should detect no solution for inconsistent system", () => {
      matrix = SlaeMatrix.fromNumbers([
        [1, -2, 3],
        [0, 0, 5],
      ]);
      method = new GaussMethod(matrix);

      const solutionType = (method as any).analyzeEchelonForm(method._matrix);
      expect(solutionType).toBe(SolutionResultType.None);
    });

    it("should detect unique solution for full rank matrix", () => {
      matrix = SlaeMatrix.fromNumbers([
        [1, 2, 3],
        [0, 1, 4],
      ]);
      method = new GaussMethod(matrix);

      const solutionType = (method as any).analyzeEchelonForm(method._matrix);
      expect(solutionType).toBe(SolutionResultType.Unique);
    });
  });

  describe("edge cases", () => {
    it("should throw error if matrix not initialized", () => {
      // simulate by creating a dummy subclass and overriding matrix
      class DummyGaussMethod extends GaussMethod {
        constructor() {
          super(SlaeMatrix.fromNumbers([[0]])); // pass dummy to satisfy ctor
          this._matrix = null as any;
        }
      }
      const broken = new DummyGaussMethod();

      expect(() => Array.from(broken.getForwardSteps())).toThrow(
        /Matrix not initialized/
      );
      expect(() => broken.backSubstitute()).toThrow(/Matrix not initialized/);
    });

    it("should handle zero matrix", () => {
      matrix = SlaeMatrix.fromNumbers([
        [0, 0, 0],
        [0, 0, 0],
      ]);
      method = new GaussMethod(matrix);

      const steps = Array.from(method.getForwardSteps());
      expect(steps.length).toBe(0);

      const solutionType = (method as any).analyzeEchelonForm(method._matrix);
      expect(solutionType).toBe(SolutionResultType.Infinite);
    });
  });
});
