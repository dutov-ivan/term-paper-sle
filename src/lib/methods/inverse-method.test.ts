import { describe, it, expect, beforeEach } from "vitest";
import { InverseMethod } from "./InverseMethod";
import { SlaeMatrix } from "../math/slae-matrix";
import { SolutionResultType } from "../solution/SolutionResultType";

// Створюємо допоміжну функцію для SLAE-матриці
function makeSlaeMatrix(matrix: number[][]): SlaeMatrix {
  return SlaeMatrix.fromNumbers(matrix);
}

describe("InverseMethod", () => {
  let method: InverseMethod;

  describe("Unique solution", () => {
    beforeEach(() => {
      // Система: x + y = 2, x - y = 0
      const matrix = makeSlaeMatrix([
        [1, 1, 2],
        [1, -1, 0],
      ]);
      method = new InverseMethod(matrix);
    });

    it("should perform forward steps without errors", () => {
      const steps = Array.from(method.getForwardSteps());
      expect(steps.length).toBeGreaterThan(0);
    });

    it("should compute correct inverse matrix", () => {
      Array.from(method.getForwardSteps()); // Виконуємо кроки
      const inverse = method.inverseMatrix.toArray();
      const expectedInverse = [
        [0.5, 0.5],
        [0.5, -0.5],
      ];
      for (let i = 0; i < expectedInverse.length; i++) {
        for (let j = 0; j < expectedInverse[i].length; j++) {
          expect(inverse[i][j]).toBeCloseTo(expectedInverse[i][j], 6);
        }
      }
    });

    it("should solve correctly with backSubstitute", () => {
      console.log("Hello");
      Array.from(method.getForwardSteps());
      const result = method.backSubstitute();
      expect(result.result).toBe(SolutionResultType.Unique);
      expect(result.roots).toEqual([1, 1]);
    });
  });

  describe("Infinite solutions", () => {
    it("should detect infinite solutions", () => {
      const matrix = makeSlaeMatrix([
        [1, -2, 1],
        [2, -4, 2],
      ]);
      const method = new InverseMethod(matrix);
      Array.from(method.getForwardSteps());
      const result = method.backSubstitute();
      expect(result.result).toBe(SolutionResultType.NoneOrInfinite);
      expect(result.description).toBe(
        "Couldn't find inverse matrix. Cannot solve."
      );
    });
  });

  describe("No solution", () => {
    it("should detect no solution", () => {
      const matrix = makeSlaeMatrix([
        [1, -2, 1],
        [2, -4, 5],
      ]);
      const method = new InverseMethod(matrix);
      Array.from(method.getForwardSteps());
      const result = method.backSubstitute();
      expect(result.result).toBe(SolutionResultType.NoneOrInfinite);
    });
  });
});
