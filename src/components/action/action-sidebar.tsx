import { useMatrixStore } from "@/store/matrix";
import { useSolutionRunner } from "../../hooks/use-solution-runner";
import { useSolutionStore } from "@/store/solution";
import { useState } from "react";
import { toast } from "sonner";
import StepControls from "./step-controls";
import StepList from "./step-list";
import { useInterval } from "../../hooks/use-interval";
import type { Direction } from "./action";
import { Skeleton } from "../ui/skeleton";

export default function ActionSidebar() {
  const slae = useMatrixStore((s) => s.slae);
  const matrixState = useMatrixStore((s) => s.matrixConfiguration);
  const setMatrix = useMatrixStore((s) => s.setMatrix);
  const setLoadingMatrix = useMatrixStore((s) => s.setIsLoadingMatrix);
  const method = useSolutionStore((s) => s.method);
  const result = useSolutionStore((s) => s.solutionResult);
  const setResult = useSolutionStore((s) => s.setSolutionResult);
  const setCurrentTargetRow = useMatrixStore((s) => s.setCurrentTargetRow);

  const [isRunning, setRunning] = useState(false);
  const [direction, setDirection] = useState<Direction>("forward");
  const [speed, setSpeed] = useState(500);

  const handleStop = () => setRunning(false);

  const { steps, index, move, skipAndFinish, loadingSteps, reset } =
    useSolutionRunner(
      method,
      slae,
      matrixState,
      setMatrix,
      setResult,
      setCurrentTargetRow,
      handleStop,
      setLoadingMatrix
    );

  useInterval(
    () => {
      if (isRunning) move(direction);
    },
    isRunning ? speed : null
  );

  const handleStart = () => {
    if (!method) return toast.error("Select a method first.");
    if (!matrixState) {
      return toast.error("Matrix is empty or invalid. Please enter a matrix.");
    }
    if (direction === "backward" && index <= 0) {
      return toast.error("Cannot move backward from the first step.");
    }
    if (direction === "forward" && index !== -1 && index > steps.length - 1) {
      return toast.error("Cannot move forward from the last step.");
    }

    setRunning(true);
    move(direction);
  };

  const handleReset = () => {
    if (!method) return toast.error("Select a method first.");
    if (!matrixState) {
      return toast.error("Matrix is empty or invalid. Please enter a matrix.");
    }
    setRunning(false);
    reset();
    setResult(null);
  };

  return (
    <div className="h-full">
      <StepControls
        isRunning={isRunning}
        handleStart={handleStart}
        handleStop={handleStop}
        handleReset={handleReset}
        direction={direction}
        setDirection={setDirection}
        moveOne={move}
        skipAndFinish={skipAndFinish}
        speed={speed}
        setSpeed={setSpeed}
        isFirstStep={index === -1}
        isLastStep={result !== null}
        canUse={!!method && !!matrixState}
      />
      <h1>Step list</h1>
      {loadingSteps ? (
        <div className="flex items-center justify-center h-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-10 mb-2" />
          ))}
        </div>
      ) : (
        <StepList steps={steps} index={index} />
      )}
    </div>
  );
}
