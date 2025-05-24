import React, { useState, useRef, useEffect } from "react";
import type { Step } from "@/lib/steps/Step.ts";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, UndoDot } from "lucide-react";
import { toast } from "sonner";
import { useMatrixStore } from "@/store/matrix";
import { useSolutionStore } from "@/store/solution";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";

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

  const matrix = useMatrixStore((s) => s.matrix);
  const setMatrix = useMatrixStore((s) => s.setMatrix);
  const method = useSolutionStore((s) => s.method);
  const setResult = useSolutionStore((s) => s.setSolutionResult);

  const iteratorRef = useRef<Iterator<Step> | null>(null);
  const startingMatrixRef = useRef<number[][]>(matrix.map((r) => [...r]));

  // Initialize iterator when method changes
  useEffect(() => {
    if (!method) return;
    iteratorRef.current = method.run(matrix);
    startingMatrixRef.current = matrix.map((r) => [...r]);
    setSteps([]);
    setIndex(-1);
    setRunning(false);
  }, [method]);

  const forwardOne = React.useCallback(() => {
    if (!iteratorRef.current) return;

    // Next from history
    if (index + 1 < steps.length) {
      const step = steps[index + 1];
      setMatrix(step.coefficients);
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
    setMatrix(next.value.coefficients);
  }, [index, steps, setMatrix, setResult, method]);

  const backwardOne = () => {
    if (index < 0) return toast.error("No more steps to go back.");
    setIndex((i) => i - 1);
    setMatrix(steps[index].coefficients);
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
    setMatrix(startingMatrixRef.current);
    setResult(null);
    iteratorRef.current = method.getForwardSteps();
  };

  // Use interval for auto-stepping
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
          <div className="flex items-center justify-between">
            <span>Speed: {speed}ms per step</span>
            <Slider
              value={[speed]}
              min={100}
              max={2000}
              step={100}
              onValueChange={([val]) => setSpeed(val)}
            />
          </div>
        </Card>
      </div>

      <h1>Action list</h1>
      <div className="flex flex-col gap-2">
        {steps.slice(0, index + 1).map((s, i) => (
          <div key={i} className="p-2 border rounded-md">
            From {s.sourceRow} to {s.targetRow} — {s.action}
          </div>
        ))}
      </div>
    </div>
  );
}
