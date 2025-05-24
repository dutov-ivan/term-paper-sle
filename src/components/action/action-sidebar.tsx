import React, { useState, useRef, useEffect } from "react";
import type { Step } from "@/lib/steps/Step.ts";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Goal, UndoDot } from "lucide-react";
import { toast } from "sonner";
import { useMatrixStore } from "@/store/matrix";
import { useSolutionStore } from "@/store/solution";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import { DecimalMatrix } from "@/lib/math/DecimalMatrix";
import Decimal from "decimal.js";

// Custom hook for interval
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);

  // Remember latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up interval
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default function ActionSidebar() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [index, setIndex] = useState(-1);
  const [isRunning, setRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const decimalMatrix = useMatrixStore((s) => s.decimalMatrix);
  const setDecimalMatrix = useMatrixStore((s) => s.setDecimalMatrix);

  const method = useSolutionStore((s) => s.method);
  const setResult = useSolutionStore((s) => s.setSolutionResult);

  const iteratorRef = useRef<Iterator<Step> | null>(null);
  const startingMatrixRef = useRef<string[][]>(decimalMatrix.toNumbers());

  useEffect(() => {
    if (!method) return;
    iteratorRef.current = method.run(decimalMatrix);
    startingMatrixRef.current = decimalMatrix.toNumbers();
    setSteps([]);
    setIndex(-1);
    setRunning(false);
  }, [method]);

  const executeStep = (step: Step) => {
    step.perform(decimalMatrix);
    setDecimalMatrix(decimalMatrix);
  };

  const forwardOne = React.useCallback(() => {
    if (!iteratorRef.current) return;

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
      setRunning(false);
      const result = method?.backSubstitute() ?? null;
      setResult(result);
      toast.success("Reached the end!");
      return;
    }

    setSteps((prev) => [...prev, next.value]);
    setIndex((i) => i + 1);
    const step = next.value;
    step.perform(decimalMatrix);
    setDecimalMatrix(decimalMatrix);
  }, [index, steps, setDecimalMatrix, setResult, method, decimalMatrix]);

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
    setRunning(false);

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
      newSteps[i].perform(decimalMatrix);
      setDecimalMatrix(decimalMatrix);
    }

    setDecimalMatrix(decimalMatrix);
    setIndex(newSteps.length - 1);

    const finalResult = method.backSubstitute();
    setResult(finalResult);

    toast.success("Reached the end!");
  };

  const handleStart = () => {
    if (!method) return toast.error("Select a method first.");
    setRunning(true);
  };

  const handleStop = () => setRunning(false);
  const handleReset = () => {
    if (!method) return toast.error("Select a method first.");
    setRunning(false);
    setSteps([]);
    setIndex(-1);
    setResult(null);

    setDecimalMatrix(DecimalMatrix.fromNumbers(startingMatrixRef.current));

    const newDecimalMatrix = new DecimalMatrix(
      startingMatrixRef.current.length,
      startingMatrixRef.current[0].length
    );
    for (let i = 0; i < startingMatrixRef.current.length; i++) {
      for (let j = 0; j < startingMatrixRef.current[i].length; j++) {
        newDecimalMatrix.set(
          i,
          j,
          new Decimal(startingMatrixRef.current[i][j])
        );
      }
    }

    setDecimalMatrix(newDecimalMatrix);
    iteratorRef.current = method.run(newDecimalMatrix);
  };

  useInterval(
    () => {
      if (isRunning) forwardOne();
    },
    isRunning ? speed : null
  );

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        {isRunning ? (
          <Button onClick={handleStop}>Stop</Button>
        ) : (
          <Button disabled={!method} onClick={handleStart}>
            Start
          </Button>
        )}

        <Button onClick={backwardOne} disabled={index < 0} variant="outline">
          <ArrowLeft />
        </Button>
        <Button onClick={forwardOne} disabled={!isRunning} variant="outline">
          <ArrowRight />
        </Button>

        <Button onClick={handleReset} variant="outline">
          Reset <UndoDot />
        </Button>

        <Card className="w-full p-2">
          <div className="flex flex-col gap-2 items-center justify-between">
            <span>Speed: {speed}ms per step</span>
            <Slider
              value={[speed]}
              min={10}
              max={300}
              step={10}
              onValueChange={([val]) => setSpeed(val)}
            />
          </div>
        </Card>
        <Button onClick={skipAndFinish}>
          <Goal />
        </Button>
      </div>

      <h1>Action list</h1>
      <div className="flex flex-col gap-2">
        {steps.slice(0, index + 1).map((s, i) => (
          <div key={i} className="p-2 border rounded-md">
            {s.print()}
          </div>
        ))}
      </div>
    </div>
  );
}
