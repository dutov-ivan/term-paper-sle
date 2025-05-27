import { useSolutionStore } from "@/store/solution";
import SlaeDisplay from "./slae-display";
import SolutionResult from "./solution-result-display";
import { Button } from "../ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import InverseMethodSlae from "./inverse-method-slae";
import { useMatrixStore } from "@/store/matrix";

function SolutionDisplay() {
  const solutionResult = useSolutionStore((state) => state.solutionResult);
  const [currentTab, setCurrentTab] = useState<"display" | "result">("display");
  const method = useSolutionStore((state) => state.method);
  const matrix = useMatrixStore((state) => state.slae);
  const isLoadingMatrix = useMatrixStore((state) => state.isLoadingMatrix);
  const currentTargetRow = useMatrixStore((state) => state.currentTargetRow);

  return currentTab === "result" && solutionResult ? (
    <>
      <SolutionResult result={solutionResult} />
      <Button onClick={() => setCurrentTab("display")}>
        <MoveLeft />
      </Button>
    </>
  ) : (
    <>
      {method === "InverseMatrix" ? (
        <InverseMethodSlae />
      ) : (
        <SlaeDisplay
          matrix={matrix}
          isLoadingMatrix={isLoadingMatrix}
          currentTargetRow={currentTargetRow}
        />
      )}
      {solutionResult && (
        <Button onClick={() => setCurrentTab("result")}>
          <MoveRight />
        </Button>
      )}
    </>
  );
}

export default SolutionDisplay;
