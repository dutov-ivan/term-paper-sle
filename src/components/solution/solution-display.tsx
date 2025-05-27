import { useSolutionStore } from "@/store/solution";
import SlaeDisplay from "./slae-display";
import SolutionResult from "./solution-result-display";
import { Button } from "../ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import InverseMethodSlae from "./inverse-method-slae";
import { useMatrixStore } from "@/store/matrix";
import { useSolutionWorkerStore } from "@/store/solutionWorker";

function SolutionDisplay() {
  const solutionResult = useSolutionStore((state) => state.solutionResult);
  const [currentTab, setCurrentTab] = useState<"display" | "result">("display");
  const method = useSolutionStore((state) => state.method);
  const matrix = useMatrixStore((state) => state.slae);
  const setSlaeCell = useMatrixStore((state) => state.setMatrixCell);
  const worker = useSolutionWorkerStore((state) => state.worker);
  const setSlae = useMatrixStore((state) => state.setSlae);
  const isRunning = useSolutionStore((state) => state.isActive);
  const isLoadingMatrix = useMatrixStore((state) => state.isLoadingMatrix);
  const currentTargetRow = useMatrixStore((state) => state.currentTargetRow);
  const isActive = useSolutionStore((state) => state.isActive);

  const [areChanges, setAreChanges] = useState(false);
  const [matrixBeforeChanges, setMatrixBeforeChanges] = useState<
    number[][] | null
  >(null);

  const setCell = async (row: number, column: number, value: number) => {
    if (!worker) {
      console.error("Worker is not initialized");
      return;
    }
    if (!areChanges) {
      setMatrixBeforeChanges(matrix ? matrix.map((r) => [...r]) : null);
    }

    setSlaeCell(row, column, value);
    setAreChanges(true);
  };

  const applyChanges = async () => {
    if (!matrix || !worker) {
      console.error("Matrix or worker is not initialized");
      return;
    }

    try {
      setAreChanges(false);
      setMatrixBeforeChanges(null);
      await worker.setMatrix(matrix);
      setSlae(matrix);
    } catch (error) {
      console.error("Error applying changes:", error);
    }
  };

  const resetChanges = () => {
    setSlae(matrixBeforeChanges || []);
    setMatrixBeforeChanges(null);
    setAreChanges(false);
  };

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
        <InverseMethodSlae
          matrix={matrix}
          isLoadingMatrix={isLoadingMatrix}
          currentTargetRow={currentTargetRow}
          isRunning={isRunning}
          setCell={setCell}
        />
      ) : (
        <SlaeDisplay
          matrix={matrix}
          isLoadingMatrix={isLoadingMatrix}
          currentTargetRow={currentTargetRow}
          isEnterable={!isActive}
          isRunning={isRunning}
          setCell={setCell}
        />
      )}
      {/* Apply/Reset changes controls */}
      {areChanges && (
        <div className="flex gap-2 mt-4">
          <Button variant="default" onClick={applyChanges}>
            Apply Changes
          </Button>
          <Button variant="outline" onClick={resetChanges}>
            Reset Changes
          </Button>
        </div>
      )}
      {solutionResult && (
        <Button
          size="icon"
          variant="outline"
          onClick={() => setCurrentTab("result")}
        >
          <MoveRight />
        </Button>
      )}
    </>
  );
}

export default SolutionDisplay;
