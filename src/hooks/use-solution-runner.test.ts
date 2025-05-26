// @vitest-environment jsdom

import { describe, beforeEach, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSolutionRunner } from "./use-solution-runner";
import { Step } from "@/lib/steps/Step";
import type { SlaeMatrix } from "@/lib/math/slae-matrix";
import { GaussMethod } from "@/lib/methods/GaussMethod";

// Correctly mock the named export from sonner
// Mock just the 'toast' export as a constant module export
vi.mock("sonner", () => {
  return {
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

// Minimal concrete Step class for testing if needed
class TestStep extends Step {
  perform(matrix: SlaeMatrix): boolean {
    // Simple perform logic for test, e.g. modify matrix a bit
    matrix.contents[this.targetRowIndex][0] += 1;
    return true;
  }

  inverse(matrix: number[][]): number[][] {
    // Inverse logic for test, e.g. revert change
    matrix[this.targetRowIndex][0] -= 1;
    return matrix;
  }
}

describe("useSolutionRunner (real types)", () => {
  let matrixCopy: number[][];
  let initialMatrix: SlaeMatrix;
  let method: GaussMethod;

  const setMatrix = vi.fn((m) => (matrixCopy = m));
  const setResult = vi.fn();
  const setCurrentTargetRow = vi.fn();
  const stop = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Create a fresh matrix for each test
    initialMatrix = {
      contents: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
    } as SlaeMatrix;
    matrixCopy = initialMatrix.contents.map((row) => [...row]);

    method = new GaussMethod();
  });

  it("does not run if method is null", () => {
    renderHook(() =>
      useSolutionRunner(
        null,
        initialMatrix,
        setMatrix,
        setResult,
        setCurrentTargetRow,
        stop,
        false
      )
    );
    expect(setMatrix).not.toHaveBeenCalled();
  });

  it("initializes iterator and stores starting matrix on non-reset", () => {
    // Spy on method.run to track calls
    const runSpy = vi.spyOn(method, "run");

    renderHook(() =>
      useSolutionRunner(
        method,
        initialMatrix,
        setMatrix,
        setResult,
        setCurrentTargetRow,
        stop,
        false
      )
    );

    expect(runSpy).toHaveBeenCalledWith(initialMatrix);
  });

  it("resets state if shouldReset is true", () => {
    const { rerender } = renderHook((props) => useSolutionRunner(...props), {
      initialProps: [
        method,
        initialMatrix,
        setMatrix,
        setResult,
        setCurrentTargetRow,
        stop,
        false,
      ],
    });

    rerender([
      method,
      initialMatrix,
      setMatrix,
      setResult,
      setCurrentTargetRow,
      stop,
      true,
    ]);

    expect(setResult).toHaveBeenCalledWith(null);
    expect(setMatrix).toHaveBeenCalled();
  });

  it("performs forwardOne and sets next step", () => {
    // Here we can push a TestStep into the iterator or override getForwardSteps if needed

    // For simplicity, monkey-patch getForwardSteps to yield one TestStep
    method.getForwardSteps = function* () {
      yield new TestStep(0, 1);
    };

    const { result } = renderHook(() =>
      useSolutionRunner(
        method,
        initialMatrix,
        setMatrix,
        setResult,
        setCurrentTargetRow,
        stop,
        false
      )
    );

    act(() => {
      result.current.forwardOne();
    });

    expect(setMatrix).toHaveBeenCalled();
    // We don't spy perform here, but since matrix was modified, setMatrix called is enough
    expect(setCurrentTargetRow).toHaveBeenCalledWith(1); // targetRowIndex from TestStep
  });

  it("backwardOne undoes the last step", () => {
    method.getForwardSteps = function* () {
      yield new TestStep(0, 1);
    };

    const { result } = renderHook(() =>
      useSolutionRunner(
        method,
        initialMatrix,
        setMatrix,
        setResult,
        setCurrentTargetRow,
        stop,
        false
      )
    );

    // set steps manually, using a real step
    act(() => {
      result.current.setSteps([new TestStep(0, 1)]);
      result.current.setIndex(0);
    });

    act(() => {
      result.current.backwardOne();
    });

    expect(setMatrix).toHaveBeenCalled();
    expect(setCurrentTargetRow).toHaveBeenCalledWith(1);
  });

  it("skipAndFinish runs all steps", () => {
    // Provide iterator with 2 steps
    method.run = () => {
      const steps = [new TestStep(0, 1), new TestStep(1, 2)];
      let i = 0;
      return {
        next: () => ({
          done: i >= steps.length,
          value: steps[i++],
        }),
        [Symbol.iterator]() {
          return this;
        },
      };
    };

    const { result } = renderHook(() =>
      useSolutionRunner(
        method,
        initialMatrix,
        setMatrix,
        setResult,
        setCurrentTargetRow,
        stop,
        false
      )
    );

    act(() => {
      result.current.skipAndFinish();
    });

    expect(stop).toHaveBeenCalled();
    expect(setMatrix).toHaveBeenCalled();
  });
});
