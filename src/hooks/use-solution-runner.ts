import type { Direction } from "@/components/action/action";
import type { MethodType } from "@/lib/methods/IMethod";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import type { StepMetadata } from "@/lib/steps/StepMetadata";
import type { MatrixConfiguration } from "@/store/matrix";
import { useSolutionWorkerStore } from "@/store/solutionWorker";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useSolutionRunner(
  method: MethodType | null,
  slae: number[][] | null,
  configuration: MatrixConfiguration | null,
  setMatrix: (contents: MatrixConfiguration) => void,
  setResult: (result: SolutionResult | null) => void,
  setCurrentTargetRow: (row: number | null) => void,
  setIsActive: (isRunning: boolean) => void,
  stop: () => void,
  setLoadingMatrix: (loading: boolean) => void,
  wasUpdated: boolean,
  stopUpdating: () => void
) {
  const [steps, setSteps] = useState<StepMetadata[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [index, setIndex] = useState(-1);
  const isFirstStep = index === -1;

  const worker = useSolutionWorkerStore((state) => state.worker);

  const startingMatrixRef = useRef<number[][] | null>(null);

  useEffect(() => {
    if (!method || !slae || slae.length === 0) return;
    if (!startingMatrixRef.current) {
      startingMatrixRef.current = slae.map((row) => [...row]);
    } else {
      reset();
    }
  }, [method]);

  useEffect(() => {
    if (!method || !slae || slae.length === 0) return;
    startingMatrixRef.current = slae.map((row) => [...row]);
    reset();
  }, [wasUpdated]);

  const reset = async () => {
    if (!worker) {
      toast.error("Worker not initialized.");
      return;
    }
    if (!startingMatrixRef.current) {
      toast.error("Starting matrix is not set.");
      return;
    }
    if (!configuration) {
      toast.error("Matrix configuration is not set.");
      return;
    }
    if (!method) {
      toast.error("Method is not selected.");
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
        adjusted: [],
        inverse: [],
      });
    }
    await worker.reset();
    await worker.setMethod(method!);
    await worker.setMatrix(startingMatrixRef.current.map((row) => [...row]));
    stopUpdating();
  };

  // Move forward or backward one step
  const move = async (direction: Direction) => {
    if (!worker) {
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
    if (!worker) return;

    const step = await worker.getNextStep();
    if (!step) {
      const result = await worker.getResult();
      setResult(result);
      setIsActive(false);
      toast.success("Reached the end!");
      return;
    }

    const updatedMatrix = await worker.getCurrentMatrix();
    if (!updatedMatrix) {
      toast.error("Failed to get updated matrix.");
      return;
    }

    setSteps((prev) => [...prev, step]);
    setMatrix(updatedMatrix);

    setCurrentTargetRow(step.targetRow);
    setIndex((i) => i + 1);
    setIsActive(true);
  };

  // Move backward one step locally using history steps
  const backwardOne = async () => {
    if (isFirstStep) {
      toast.error("Already at the beginning.");
      stop();
      setIsActive(false);
      return;
    }
    if (!worker || !steps || steps.length === 0) {
      toast.error("No previous steps available.");
      return;
    }

    const prevIndex = index - 1;
    const prevStep = await worker.getPreviousStep();
    if (!prevStep) {
      toast.error("No previous step found.");
      return;
    }

    const newMatrix = await worker.getCurrentMatrix();
    if (!newMatrix) {
      toast.error("Failed to get updated matrix.");
      return;
    }

    setMatrix(newMatrix);
    setCurrentTargetRow(steps[prevIndex].targetRow);
    setIndex(prevIndex);
    setIsActive(true);
  };

  // Skip to end or reset
  const skipAndFinish = async (direction: Direction) => {
    if (!worker) {
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

    setIsActive(true);
    if (direction === "forward") {
      await skipAndFinishForward();
    } else if (direction === "backward") {
      if (index <= 0) {
        toast.error("Already at the first step.");
        return;
      }
      await skipAndFinishBackward();
    }
    setIsActive(false);
  };

  // Skip forward all steps via worker
  const skipAndFinishForward = async () => {
    stop();

    if (!worker || !configuration) return;

    setLoadingMatrix(true);
    setLoadingSteps(true);

    const res = await worker.skipAndFinishForward();
    if (!res) {
      toast.error("Failed to skip and finish forward.");
      setLoadingSteps(false);
      setLoadingMatrix(false);
      return;
    }

    const { results, steps, matrix: updatedMatrix } = res;

    if (results) setResult(results);
    setMatrix(updatedMatrix);
    setSteps(steps);
    setIndex(steps.length - 1);

    setLoadingSteps(false);
    setLoadingMatrix(false);
  };

  const skipAndFinishBackward = async () => {
    if (!startingMatrixRef.current) {
      toast.error("Starting matrix is not set.");
      return;
    }
    if (!method) {
      toast.error("Select a method first.");
      return;
    }

    stop();
    if (!worker || !configuration) return;

    setSteps([]);
    setIndex(-1);
    const newMatrix = await worker.skipAndFinishBackward();
    if (!newMatrix) {
      toast.error("Failed to skip and finish backward.");
      return;
    }

    setMatrix(newMatrix);
    setResult(null);
    setCurrentTargetRow(null);
    await worker.reset();
    await worker.setMethod(method);
    await worker.setMatrix(startingMatrixRef.current.map((row) => [...row]));
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
