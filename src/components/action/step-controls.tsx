import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Goal, UndoDot } from "lucide-react";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";
import type { Direction } from "./action";

interface StepControlsProps {
  isRunning: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  handleStart: () => void;
  handleStop: () => void;
  handleReset: () => void;
  direction: Direction;
  setDirection: (value: Direction) => void;
  moveOne: (direction: Direction) => void;
  skipAndFinish: (direction: Direction) => void;
  speed: number;
  setSpeed: (value: number) => void;
  canUse: boolean;
}

const StepControls = ({
  isRunning,
  handleStart,
  handleStop,
  handleReset,
  direction,
  setDirection,
  moveOne,
  skipAndFinish,
  speed,
  setSpeed,
  canUse,
  isFirstStep,
  isLastStep,
}: StepControlsProps) => {
  const impossibleToMoveForward = isLastStep && direction === "forward";
  const impossibleToMoveBackward = isFirstStep && direction === "backward";

  const toggleDirection = () => {
    if (direction === "forward") {
      setDirection("backward");
    } else {
      setDirection("forward");
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 mb-4 items-center",
        !canUse && "opacity-50 pointer-events-none select-none"
      )}
    >
      {isRunning ? (
        <Button onClick={handleStop}>Stop</Button>
      ) : (
        <Button onClick={handleStart}>Start</Button>
      )}

      <Button
        onClick={() => moveOne(direction)}
        variant={"outline"}
        disabled={
          !canUse || impossibleToMoveBackward || impossibleToMoveForward
        }
      >
        Move
      </Button>

      <Button onClick={toggleDirection} variant="outline">
        {direction === "forward" ? (
          <>
            Forward
            <ArrowRight />
          </>
        ) : (
          <>
            Backward
            <ArrowLeft />
          </>
        )}
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
      <Button onClick={() => skipAndFinish(direction)}>
        <Goal />
      </Button>
    </div>
  );
};

export default StepControls;
