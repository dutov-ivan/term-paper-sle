import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Goal, UndoDot } from "lucide-react";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import type { IMethod } from "@/lib/methods/IMethod";

interface StepControlsProps {
  isRunning: boolean;
  handleStart: () => void;
  handleStop: () => void;
  handleReset: () => void;
  forwardOne: () => void;
  backwardOne: () => void;
  skipAndFinish: () => void;
  speed: number;
  setSpeed: (value: number) => void;
  method: IMethod | null;
  index: number;
}

const StepControls = ({
  isRunning,
  handleStart,
  handleStop,
  handleReset,
  forwardOne,
  backwardOne,
  skipAndFinish,
  speed,
  setSpeed,
  method,
  index,
}: StepControlsProps) => {
  return (
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
  );
};

export default StepControls;
