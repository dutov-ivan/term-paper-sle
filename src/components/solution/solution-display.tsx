import { useSolutionStore } from "@/store/solution";
import SlaeDisplay from "./slae-display";
import SolutionResult from "./solution-result-display";
import { Button } from "../ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";

function SolutionDisplay() {
  const solutionResult = useSolutionStore((state) => state.solutionResult);
  const [currentTab, setCurrentTab] = useState<"display" | "result">("display");

  return solutionResult ? (
    currentTab === "result" ? (
      <>
        <SolutionResult result={solutionResult} />
        <Button onClick={() => setCurrentTab("display")}>
          <MoveLeft />
        </Button>
      </>
    ) : (
      <>
        <SlaeDisplay />
        <Button onClick={() => setCurrentTab("result")}>
          <MoveRight />
        </Button>
      </>
    )
  ) : (
    <SlaeDisplay />
  );
}

export default SolutionDisplay;
