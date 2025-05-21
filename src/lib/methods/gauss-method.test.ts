import { describe, it, expect } from "vitest";
import { GaussMethod } from "./GaussMethod";
import { Matrix } from "../Matrix";
import { SolutionResultType } from "../solution/SolutionResultType";
import type { IMethod } from "./IMethod";

function solve(method: IMethod, matrix: Matrix) {
  const steps = method.getForwardSteps(matrix);
  for (const _ of steps) {
  }
  return method.backSubstitute();
}

function getSteps(method: IMethod, matrix: Matrix) {
  const steps = [];
  for (const step of method.getForwardSteps(matrix)) {
    steps.push(step);
  }
  return steps;
}

describe("GaussMethod", () => {
  const backSubstituteCases = [
    {
      matrix: new Matrix([
        [2, 1, 5],
        [0, 1, 1],
      ]),
      expectedType: SolutionResultType.Unique,
      expectedRoots: [2.0, 1.0] as number[] | null,
    },
    {
      matrix: new Matrix([
        [1, 2, 3],
        [0, 0, 0],
      ]),
      expectedType: SolutionResultType.Infinite,
      expectedRoots: null,
    },
    {
      matrix: new Matrix([
        [1, 2, 3],
        [0, 0, 1],
      ]),
      expectedType: SolutionResultType.None,
      expectedRoots: null,
    },
  ];

  backSubstituteCases.forEach(
    ({ matrix, expectedType, expectedRoots }, idx) => {
      it(`backSubstitute returns correct solution for case #${idx + 1}`, () => {
        const result = solve(new GaussMethod(), matrix);
        expect(result.result).toBe(expectedType);
        if (expectedType === SolutionResultType.Unique) {
          expect(result.roots).not.toBeNull();
          expect(expectedRoots).not.toBeNull();
          expect(result.roots!.length).toBe(expectedRoots!.length);
          for (let i = 0; i < expectedRoots!.length; i++) {
            expect(result.roots![i]).toBeCloseTo(expectedRoots![i], 6);
          }
        }
      });
    }
  );

  const forwardEliminationCases = [
    {
      matrix: new Matrix([
        [2, 1, 5],
        [4, -6, -2],
      ]),
      expectedStepCount: 2, // 1 swap + 1 elimination
    },
    {
      matrix: new Matrix([
        [1, 2, 3],
        [0, 1, 4],
        [0, 0, 1],
      ]),
      expectedStepCount: 3, // Already upper-triangular, 3 elimination steps
    },
  ];

  forwardEliminationCases.forEach(({ matrix, expectedStepCount }, idx) => {
    it(`getForwardSteps yields expected steps for case #${idx + 1}`, () => {
      const steps = getSteps(new GaussMethod(), matrix);
      expect(steps.length).toBe(expectedStepCount);
      for (const step of steps) {
        expect(step.sourceRow).toBeGreaterThanOrEqual(0);
        expect(step.sourceRow).toBeLessThan(matrix.rows);
        expect(step.targetRow).toBeGreaterThanOrEqual(0);
        expect(step.targetRow).toBeLessThan(matrix.rows);
        expect(step.coefs).not.toBeNull();
      }
    });
  });
});
