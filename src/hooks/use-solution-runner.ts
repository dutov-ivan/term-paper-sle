import type { Direction } from "@/components/action/action";
import type { MethodType } from "@/lib/methods/IMethod";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import type { StepMetadata } from "@/lib/steps/StepMetadata";
import type { MatrixConfiguration } from "@/store/matrix";
import { createSolutionWorker } from "@/workers/solution.worker-wrapper";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useSolutionRunner(
  method: MethodType | null,
  slae: number[][] | null,
  configuration: MatrixConfiguration | null,
  setMatrix: (contents: MatrixConfiguration) => void,
  setResult: (result: SolutionResult | null) => void,
  setCurrentTargetRow: (row: number | null) => void,
  stop: () => void,
  setLoadingMatrix: (loading: boolean) => void
) {
  const [steps, setSteps] = useState<StepMetadata[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [index, setIndex] = useState(-1);
  const isFirstStep = index === -1;

  const currentMatrix =
    configuration?.type === "standard"
      ? configuration.matrix
      : configuration?.adjusted || [];

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
    if (!method || !slae || slae.length === 0) return;

    (async () => {
      if (!workerRef.current) return;
      startingMatrixRef.current = currentMatrix.map((row) => [...row]);

      try {
        await workerRef.current.initializeSolution(method, slae);
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

  const reset = async () => {
    if (!workerRef.current) return;
    if (!configuration) {
      toast.error("Matrix configuration is not set.");
      return;
    }

    setResult(null);
    setSteps([]);
    setIndex(-1);
    if (configuration?.type === "standard") {
      setMatrix({
        type: "standard",
        matrix: startingMatrixRef.current.map((row) => [...row]),
      });
    } else if (configuration?.type === "inverse") {
      setMatrix({
        type: "inverse",
        adjusted: [], // Reset adjusted to empty array
        inverse: [],
      });
    }
    await workerRef.current.reset();
    await workerRef.current.initializeSolution(
      method!,
      startingMatrixRef.current
    );
  };

  // Move forward or backward one step
  const move = async (direction: Direction) => {
    if (!workerRef.current) {
      toast.error("Worker not initialized.");
      return;
    }

    if (!configuration) {
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
    if (!updatedMatrix) {
      toast.error("Failed to get updated matrix.");
      return;
    }

    setSteps((prev) => [...prev, step]);
    setMatrix(updatedMatrix);

    setCurrentTargetRow(step.targetRow);
    setIndex((i) => i + 1);
  };

  // Move backward one step locally using history steps
  const backwardOne = async () => {
    if (isFirstStep) {
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

    const newMatrix = await workerRef.current.getCurrentMatrix();
    if (!newMatrix) {
      toast.error("Failed to get updated matrix.");
      return;
    }

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

    if (!configuration) {
      toast.error("Matrix is empty or invalid. Please enter a matrix.");
      return;
    }

    if (direction === "forward") {
      await skipAndFinishForward();
    } else if (direction === "backward") {
      if (index <= 0) {
        toast.error("Already at the first step.");
        return;
      }
      await skipAndFinishBackward();
    }
  };

  // Skip forward all steps via worker
  const skipAndFinishForward = async () => {
    stop();

    if (!workerRef.current || !configuration) return;

    setLoadingMatrix(true);
    setLoadingSteps(true);

    const {
      results,
      steps,
      matrix: updatedMatrix,
    } = (await workerRef.current.skipAndFinishForward())!;

    if (results) setResult(results);
    setMatrix(updatedMatrix);
    setSteps(steps);
    setIndex(steps.length - 1);

    setLoadingSteps(false);
    setLoadingMatrix(false);
  };

  const skipAndFinishBackward = async () => {
    stop();
    if (!workerRef.current || !configuration) return;

    setSteps([]);
    setIndex(-1);
    const newMatrix = await workerRef.current.skipAndFinishBackward();
    if (!newMatrix) {
      toast.error("Failed to skip and finish backward.");
      return;
    }

    setMatrix(newMatrix);
    setResult(null);
    setCurrentTargetRow(null);
    await workerRef.current.reset();
    await workerRef.current.initializeSolution(method!, slae!);
  };

  return {
    steps,
    index,
    move,
    skipAndFinish,
    stop,
    reset,
    setSteps,
    setIndex,
    startingMatrixRef,
    loadingSteps,
  };
}
