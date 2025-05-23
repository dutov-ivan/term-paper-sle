import React, { useState, useRef, useEffect } from "react";
import type { Step } from "@/lib/steps/Step.ts";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, UndoDot } from "lucide-react";
import { toast } from "sonner";
import { useMatrixStore } from "@/store/matrix";
import { useSolutionStore } from "@/store/solution";
import { StepAction } from "@/lib/steps/StepAction";

function ActionSidebar() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isStarted, setIsRunning] = useState(false);
  const matrix = useMatrixStore((state) => state.matrix);
  const [startingMatrix, setStartingMatrix] = useState<number[][] | null>(
    matrix
  );
  console.log(matrix);

  const setMatrix = useMatrixStore((state) => state.setMatrix);
  const method = useSolutionStore((state) => state.method);
  const setResult = useSolutionStore((state) => state.setSolutionResult);

  const iteratorRef = useRef<Iterator<Step> | null>(null);

  useEffect(() => {
    if (!method) return;
    iteratorRef.current = method.run(matrix);
  }, [method]);

  const handleStart = () => {
    setIsRunning(true);
    setStartingMatrix(matrix.map((row) => [...row]));
  };
  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (!method) {
      toast.error("Please select a method first.");
      return;
    }

    if (!iteratorRef.current) return;

    setIsRunning(false);
    setSteps([]);
    setCurrentStepIndex(-1);
    setMatrix(startingMatrix!.map((row) => [...row]));
    setResult(null);

    iteratorRef.current = method.getForwardSteps();
  };

  const forwardOne = () => {
    if (!isStarted) {
      toast.error("Please start the process first.");
      return;
    }

    if (!method) {
      toast.error("Please select a method first.");
      return;
    }

    if (!iteratorRef.current) return;

    if (currentStepIndex + 1 < steps.length) {
      const step = steps[currentStepIndex + 1];
      setMatrix([...step.coefficients]);
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      const nextStep = iteratorRef.current.next();
      if (nextStep.done) {
        setIsRunning(false);
        toast.success("Hooray! You have reached the end of the steps.");
        const result = method.backSubstitute();
        setResult(result);
        return;
      }
      const step = nextStep.value;
      setSteps((prev) => [...prev, step]);
      setCurrentStepIndex((prev) => prev + 1);
      setMatrix([...step.coefficients]);
    }
  };

  const backwardOne = () => {
    if (!isStarted) {
      toast.error("Please start the process first.");
      return;
    }
    if (steps.length === 0) {
      toast.error("No more steps to go back.");
      return;
    }
    const lastStep = steps[steps.length - 1];
    setMatrix([...lastStep.coefficients]);
    setSteps((prev) => prev.slice(0, prev.length - 1));
    setCurrentStepIndex((prev) => prev - 1);
  };

  const isNoStepsDone = steps.length === 0;
  const isLastPossibleStep =
    steps.length !== 0 && steps[steps.length - 1].action === StepAction.Done;
  const isMatrixEmpty = matrix.length === 0;

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        {isStarted ? (
          <Button onClick={handleStop}>Stop</Button>
        ) : (
          <Button disabled={isMatrixEmpty} onClick={handleStart}>
            Start
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            disabled={isNoStepsDone}
            onClick={backwardOne}
            variant="outline"
          >
            <ArrowLeft />
          </Button>
          <Button
            disabled={!isStarted || isLastPossibleStep}
            variant="outline"
            onClick={forwardOne}
          >
            <ArrowRight />
          </Button>
        </div>

        <Button
          disabled={!isStarted && steps.length === 0}
          onClick={handleReset}
          variant="outline"
        >
          Reset <UndoDot />
        </Button>
      </div>
      <h1>Action list</h1>
      <div className="flex flex-col gap-2">
        {Array.from({ length: currentStepIndex + 1 }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <span>
              From {steps[index].sourceRow} to {steps[index].targetRow} doing{" "}
              {steps[index].action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionSidebar;
