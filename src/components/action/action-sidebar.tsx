import React, { useMemo, useState, useRef, useEffect } from "react";
import type { Step } from "@/lib/steps/Step.ts";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, UndoDot } from "lucide-react";
import type { SolutionPreferencesType } from "@/lib/solution/SolutionPreferences";
import {
  createSolutionMethodFromType,
  MethodType,
} from "@/lib/methods/IMethod";
import { Matrix } from "@/lib/Matrix";
import { toast } from "sonner";
import { useMatrixStore } from "@/store/matrix";
import { useSolutionStore } from "@/store/solution";

function ActionSidebar() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const matrix = useMatrixStore((state) => state.matrix);
  const setMatrix = useMatrixStore((state) => state.setMatrix);
  const method = useSolutionStore((state) => state.method);

  const matrixObj = useMemo(() => new Matrix(matrix), [matrix]);
  const iteratorRef = useRef<Iterator<Step> | null>(null);

  useEffect(() => {
    if (!method) return;
    iteratorRef.current = method.getForwardSteps(matrixObj);
  }, [method, matrixObj]);

  const handleStart = () => {
    setIsRunning(true);
  };
  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (!method) {
      toast.error("Please select a method first.");
      return;
    }
    setIsRunning(false);
    setSteps([]);
    setMatrix([]);
    iteratorRef.current = method.getForwardSteps(matrixObj);
  };

  const forwardOne = () => {
    if (!isRunning) {
      toast.error("Please start the process first.");
      return;
    }
    if (!iteratorRef.current) return;
    const nextStep = iteratorRef.current.next();
    if (nextStep.done) {
      setIsRunning(false);
      toast.success("Hooray! You have reached the end of the steps.");
      return;
    }
    const step = nextStep.value;
    setSteps((prev) => [...prev, step]);
    setMatrix([...step.coefficients.contents]);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        {isRunning ? (
          <Button onClick={handleStop}>Stop</Button>
        ) : (
          <Button onClick={handleStart}>Start</Button>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={forwardOne}>
            <ArrowLeft />
          </Button>
          <Button variant="outline">
            <ArrowRight />
          </Button>
        </div>

        <Button onClick={handleReset} variant="outline">
          Reset <UndoDot />
        </Button>
      </div>
      <h1>Action list</h1>
      <div className="flex flex-col gap-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <span>
              From {step.sourceRow} to {step.targetRow} doing {step.action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionSidebar;
