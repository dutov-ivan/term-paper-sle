import { useMatrixStore } from "@/store/matrix";
import { useSolutionRunner } from "../../hooks/use-solution-runner";
import { useSolutionStore } from "@/store/solution";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import StepControls from "./step-controls";
import StepList from "./step-list";
import { useInterval } from "../../hooks/use-interval";
import type { Direction } from "./action";
import { Skeleton } from "../ui/skeleton";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

export default function ActionSidebar({
  showStepListInDrawer = false,
}: { showStepListInDrawer?: boolean } = {}) {
  const slae = useMatrixStore((s) => s.slae);
  const matrixState = useMatrixStore((s) => s.matrixConfiguration);
  const setMatrix = useMatrixStore((s) => s.setMatrixConfiguration);
  const setLoadingMatrix = useMatrixStore((s) => s.setIsLoadingMatrix);
  const method = useSolutionStore((s) => s.method);
  const result = useSolutionStore((s) => s.solutionResult);
  const setResult = useSolutionStore((s) => s.setSolutionResult);
  const setCurrentTargetRow = useMatrixStore((s) => s.setCurrentTargetRow);

  const setIsActive = useSolutionStore((s) => s.setIsActive);

  const [isRunning, setRunning] = useState(false);
  const [direction, setDirection] = useState<Direction>("forward");
  const [speed, setSpeed] = useState(500);
  const [isMobile, setIsMobile] = useState(false);
  const wasUpdated = useMatrixStore((s) => s.wasUpdated);
  const stopUpdating = useMatrixStore((s) => s.stopUpdating);

  const handleStop = () => setRunning(false);

  const { steps, index, move, skipAndFinish, loadingSteps, reset } =
    useSolutionRunner(
      method,
      slae,
      matrixState,
      setMatrix,
      setResult,
      setCurrentTargetRow,
      setIsActive,
      handleStop,
      setLoadingMatrix,
      wasUpdated,
      stopUpdating
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-full fixed">
      {isMobile ? (
        <>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="fixed z-50 bottom-4 right-4 bg-primary text-primary-foreground rounded-full shadow-lg p-4 md:hidden">
                <Menu />
                <span className="sr-only">Open Step Controls</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle>Step Controls</DrawerTitle>
              </DrawerHeader>
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
              {showStepListInDrawer && (
                <div className="mt-4">
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
              )}
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          {!showStepListInDrawer && (
            <div className="mt-4">
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
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
