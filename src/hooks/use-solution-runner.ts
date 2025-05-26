import type { Direction } from "@/components/action/action";
import type { MethodType } from "@/lib/methods/IMethod";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import type { StepMetadata } from "@/lib/steps/StepMetadata";
import { createSolutionWorker } from "@/workers/solution.worker-wrapper";
import { skip } from "node:test";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useSolutionRunner(
  method: MethodType | null,
  matrix: number[][] | null,
  setMatrix: (contents: number[][]) => void,
  setResult: (result: SolutionResult | null) => void,
  setCurrentTargetRow: (row: number | null) => void,
  stop: () => void,
  shouldReset: boolean,
  setLoadingMatrix: (loading: boolean) => void
) {
  const [steps, setSteps] = useState<StepMetadata[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [index, setIndex] = useState(-1);

  const workerRef = useRef<ReturnType<typeof createSolutionWorker> | null>(
    null
  );
  const startingMatrixRef = useRef<number[][]>([]);

  // Initialize worker once
  useEffect(() => {
    workerRef.current = createSolutionWorker();
  }, []);

  // Setup / reset worker state when method or matrix changes or reset requested
  useEffect(() => {
    if (!method || !matrix || matrix.length === 0) return;

    (async () => {
      if (!workerRef.current) return;
      startingMatrixRef.current = matrix.map((row) => [...row]);
      console.log("Setting method:", method, "with matrix:", matrix);

      try {
        await workerRef.current.initializeSolution(method, matrix);
        setResult(null); // or: setResult(result) if available
        setSteps([]);
        setIndex(-1);
        // You may also call setMatrix(matrix.contents); if you want to re-show matrix
      } catch (error) {
        toast.error("Failed to set method in worker.");
        console.error("[useSolutionRunner] setMethod error", error);
      }
    })();
  }, [method]);

  useEffect(() => {
    (async () => {
      if (!shouldReset) return;
      if (!workerRef.current) return;
      setResult(null);
      setSteps([]);
      setIndex(-1);
      setMatrix(startingMatrixRef.current.map((row) => [...row]));
      await workerRef.current.reset();
      await workerRef.current.initializeSolution(
        method!,
        startingMatrixRef.current
      );
    })();
  }, [shouldReset]);

  // Move forward or backward one step
  const move = async (direction: Direction) => {
    if (!workerRef.current) {
      toast.error("Worker not initialized.");
      return;
    }

    if (!matrix) {
      toast.error("Matrix is not set. Please enter a matrix first.");
      return;
    }

    if (direction === "forward") {
      await forwardOne();
    } else if (direction === "backward") {
      backwardOne();
    }
  };

  // Move forward one step via worker
  const forwardOne = async () => {
    if (!workerRef.current) return;

    const step = await workerRef.current.getNextStep();
    if (!step) {
      const result = await workerRef.current.getResult();
      setResult(result);
      toast.success("Reached the end!");
      return;
    }

    const updatedMatrix = await workerRef.current.getCurrentMatrix();
    console.log(updatedMatrix);

    setSteps((prev) => [...prev, step]);
    setMatrix(updatedMatrix);
    setCurrentTargetRow(step.targetRow);
    setIndex((i) => i + 1);
  };

  // Move backward one step locally using history steps
  const backwardOne = async () => {
    if (index <= 0) {
      toast.error("Already at the beginning.");
      stop();
      return;
    }
    if (!workerRef.current || !steps || steps.length === 0) {
      toast.error("No previous steps available.");
      return;
    }

    const prevIndex = index - 1;
    const prevStep = await workerRef.current.getPreviousStep();
    if (!prevStep) {
      toast.error("No previous step found.");
      return;
    }
    console.log(prevStep);

    const newMatrix = await workerRef.current.getCurrentMatrix();

    setMatrix(newMatrix);
    setCurrentTargetRow(steps[prevIndex].targetRow);
    setIndex(prevIndex);
  };

  // Skip to end or reset
  const skipAndFinish = async (direction: Direction) => {
    if (!workerRef.current) {
      toast.error("Worker not initialized.");
      return;
    }

    if (!method) {
      toast.error("Select a method first.");
      return;
    }

    if (!matrix) {
      toast.error("Matrix is empty or invalid. Please enter a matrix.");
      return;
    }

    if (direction === "forward") {
      await skipAndFinishForward();
    } else if (direction === "backward") {
      await skipAndFinishBackward();
    }
  };

  // Skip forward all steps via worker
  const skipAndFinishForward = async () => {
    stop();

    if (!workerRef.current || !matrix) return;

    setLoadingMatrix(true);
    setLoadingSteps(true);

    const { results, matrix: updatedMatrix } =
      (await workerRef.current.skipAndFinishForward())!;

    if (results) setResult(results);
    setMatrix(updatedMatrix);
    // Since we skip all, reset steps and index to last
    // You may want to store full steps if your worker returns them, else just reset here
    setSteps([]); // Or keep last steps if returned
    setIndex(-1);

    setLoadingSteps(false);
    setLoadingMatrix(false);
  };

  const skipAndFinishBackward = async () => {
    stop();
    if (!workerRef.current || !matrix) return;

    setSteps([]);
    setIndex(-1);
    const newMatrix = startingMatrixRef.current.map((row) => [...row]);
    setMatrix(newMatrix);
    setResult(null);
    setCurrentTargetRow(null);
    await workerRef.current.reset();
    await workerRef.current.initializeSolution(method!, newMatrix);
  };

  return {
    steps,
    index,
    move,
    skipAndFinish,
    reset: stop,
    setSteps,
    setIndex,
    startingMatrixRef,
    loadingSteps,
  };
}
