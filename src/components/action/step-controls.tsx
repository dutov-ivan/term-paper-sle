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
}: StepControlsProps) => {

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
        "flex flex-col gap-2 mb-4 w-full",
        !canUse && "opacity-50 pointer-events-none select-none"
      )}
    >
      {/* First row: Start/Stop, Reset, Direction */}
      <div className="flex gap-4 items-center w-full">
        {isRunning ? (
          <Button onClick={handleStop}>Stop</Button>
        ) : (
          <Button onClick={handleStart}>Start</Button>
        )}
        <Button onClick={handleReset} variant="outline">
          Reset <UndoDot />
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
      </div>
      {/* Second row: Move, Complete, Speed */}
      <div className="flex gap-4 items-center w-full">
        <Button
          onClick={() => moveOne(direction)}
          variant={"outline"}
          disabled={isRunning || !canUse}
        >
          Move
        </Button>
        <Button onClick={() => skipAndFinish(direction)}>
          <Goal />
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
      </div>
    </div>
  );
};

export default StepControls;
