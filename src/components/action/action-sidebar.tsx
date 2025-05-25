import { useMatrixStore } from "@/store/matrix";
import { useSolutionRunner } from "./use-solution-runner";
import { useSolutionStore } from "@/store/solution";
import { useState } from "react";
import { toast } from "sonner";
import StepControls from "./step-controls";
import StepList from "./step-list";
import { useInterval } from "./use-interval";

export default function ActionSidebar() {
  const matrix = useMatrixStore((s) => s.matrix);
  const setMatrix = useMatrixStore((s) => s.setMatrix);
  const method = useSolutionStore((s) => s.method);
  const setResult = useSolutionStore((s) => s.setSolutionResult);

  const [isRunning, setRunning] = useState(false);
  const [shouldReset, setShouldReset] = useState(true);
  const [speed, setSpeed] = useState(500);

  const handleStop = () => setRunning(false);

  const { steps, index, forwardOne, backwardOne, skipAndFinish } =
    useSolutionRunner(
      method,
      matrix,
      setMatrix,
      setResult,
      handleStop,
      shouldReset
    );

  useInterval(
    () => {
      if (isRunning) forwardOne();
    },
    isRunning ? speed : null
  );

  const handleStart = () => {
    if (!method) return toast.error("Select a method first.");
    if (!matrix || matrix.rows === 0 || matrix.cols === 0) {
      return toast.error("Matrix is empty or invalid. Please enter a matrix.");
    }
    setRunning(true);
    setShouldReset(false);
    forwardOne();
  };

  const handleReset = () => {
    if (!method) return toast.error("Select a method first.");
    if (!matrix || matrix.rows === 0 || matrix.cols === 0) {
      return toast.error("Matrix is empty or invalid. Please enter a matrix.");
    }
    setRunning(false);
    setShouldReset(true);
    setResult(null);
  };

  return (
    <div>
      <StepControls
        isRunning={isRunning}
        handleStart={handleStart}
        handleStop={handleStop}
        handleReset={handleReset}
        skipAndFinish={skipAndFinish}
        speed={speed}
        setSpeed={setSpeed}
        forwardOne={forwardOne}
        backwardOne={backwardOne}
        index={index}
        method={method}
      />
      <h1>Action list</h1>
      <StepList steps={steps} index={index} />
    </div>
  );
}
