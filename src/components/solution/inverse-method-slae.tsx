import { useState } from "react";
import { Button } from "../ui/button";
import SlaeDisplay from "./slae-display";
import { useMatrixStore } from "@/store/matrix";
import { toast } from "sonner";

const InverseMethodSlae = ({
  matrix,
  isLoadingMatrix,
  currentTargetRow,
  isRunning,
  setCell,
}: {
  matrix: number[][] | null;
  isLoadingMatrix: boolean;
  currentTargetRow: number | null;
  isRunning: boolean;
  setCell: ((row: number, column: number, value: number) => void) | null;
}) => {
  const matrixState = useMatrixStore((state) => state.matrixConfiguration);
  const originalMatrix = useMatrixStore((state) => state.slae);

  const [inverseMethodMatrixView, setInverseMethodMatrixView] = useState<
    "original" | "adjusted" | "inverse"
  >("original");

  const getNextView = (current: "original" | "adjusted" | "inverse") => {
    if (current === "original") return "adjusted";
    if (current === "adjusted") return "inverse";
    return "original";
  };

  const toggleInverseMethodMatrixView = () => {
    if (!matrixState) {
      toast.error("Matrix is empty or invalid. Please enter a matrix.");
      return;
    }
    setInverseMethodMatrixView((prev) => getNextView(prev));
  };

  const getButtonLabel = () => {
    if (inverseMethodMatrixView === "original") return "View Adjusted";
    if (inverseMethodMatrixView === "adjusted") return "View Inverse";
    return "View Original";
  };

  const getMatrixForView = () => {
    if (inverseMethodMatrixView === "original") {
      return originalMatrix ?? matrix;
    }
    if (inverseMethodMatrixView === "adjusted") {
      return matrixState?.type === "inverse" ? matrixState.adjusted : null;
    }
    // inverse
    return matrixState?.type === "inverse" ? matrixState.inverse : null;
  };

  // Determine if the matrix should be editable
  const isEditable = inverseMethodMatrixView === "original";

  // SlaeDisplay expects isEnterable and setCell props for editability
  return (
    <>
      <Button onClick={toggleInverseMethodMatrixView}>
        {getButtonLabel()}
      </Button>
      <SlaeDisplay
        matrix={getMatrixForView()}
        isLoadingMatrix={isLoadingMatrix}
        currentTargetRow={currentTargetRow}
        emptyText="Inverse method wasn't started yet."
        isEnterable={isEditable}
        isRunning={isRunning}
        setCell={setCell}
      />
    </>
  );
};

export default InverseMethodSlae;
