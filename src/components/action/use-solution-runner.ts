import type { SlaeMatrix } from "@/lib/math/slae-matrix";
import type { IMethod } from "@/lib/methods/IMethod";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import type { Step } from "@/lib/steps/Step";
import { useEffect, useRef, useState } from "react";
import { start } from "repl";
import { toast } from "sonner";

export function useSolutionRunner(
  method: IMethod | null,
  matrix: SlaeMatrix | null,
  setMatrix: (contents: number[][]) => void,
  setResult: (result: SolutionResult | null) => void,
  stop: () => void,
  shouldReset: boolean
) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [index, setIndex] = useState(-1);

  const iteratorRef = useRef<Iterator<Step> | null>(null);

  useEffect(() => {
    if (!method) return;
    if (!matrix || matrix.rows === 0 || matrix.cols === 0) return;

    if (shouldReset) {
      iteratorRef.current = null;
      setResult(null);
      // Deep copy for reset
      setMatrix(startingMatrixRef.current.map((row) => [...row]));
      setSteps([]);
      setIndex(-1);
    } else {
      iteratorRef.current = method.run(matrix);
      startingMatrixRef.current = matrix.contents.map((row) => [...row]);
    }
  }, [shouldReset]);

  const startingMatrixRef = useRef<number[][]>([]);

  const executeStep = (step: Step) => {
    if (!matrix) {
      toast.error("Matrix is not set. Please enter a matrix first.");
      return;
    }
    step.perform(matrix);
    setMatrix(matrix.contents);
  };

  const forwardOne = () => {
    console.log("Step index:", index);
    if (!iteratorRef.current) return;
    if (!matrix) {
      toast.error("Matrix is not set. Please enter a matrix first.");
      return;
    }

    // Next from history
    if (index + 1 < steps.length) {
      const step = steps[index + 1];
      executeStep(step);
      setIndex((i) => i + 1);
      return;
    }

    // Pull new step
    const next = iteratorRef.current.next();
    if (next.done) {
      const result = method?.backSubstitute() ?? null;
      setResult(result);
      toast.success("Reached the end!");

      return;
    }

    const step = next.value;
    executeStep(step);

    setSteps((prev) => [...prev, next.value]);
    setIndex((i) => i + 1);
  };
  const backwardOne = () => {
    if (index < 0) return toast.error("No more steps to go back.");
    setIndex((i) => i - 1);
    // TODO: Window for matrix state, instead of just the last step
    throw new Error("Not implemented: Step inverse logic");
    // const previousMatrix = step.inverse(matrix);
    // setMatrix(previousMatrix);
  };

  const skipAndFinish = () => {
    if (!method || !iteratorRef.current)
      return toast.error("Select a method first.");

    if (!matrix || matrix.rows === 0 || matrix.cols === 0) {
      return toast.error("Matrix is empty or invalid. Please enter a matrix.");
    }

    stop();

    const newSteps = [...steps];
    let result = iteratorRef.current.next();

    while (!result.done) {
      newSteps.push(result.value);
      result = iteratorRef.current.next();
    }

    if (newSteps.length === 0) {
      toast.error("No steps were generated.");
      return;
    }

    setSteps(newSteps);

    for (let i = index + 1; i < newSteps.length; i++) {
      newSteps[i].perform(matrix);
    }

    setMatrix(matrix.contents);

    setIndex(newSteps.length - 1);
  };

  return {
    steps,
    index,
    forwardOne,
    backwardOne,
    skipAndFinish,
    reset: stop,
    setSteps,
    setIndex,
    startingMatrixRef,
    iteratorRef,
  };
}
