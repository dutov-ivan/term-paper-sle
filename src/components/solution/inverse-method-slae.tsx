import React, { useState } from "react";
import { Button } from "../ui/button";
import SlaeDisplay from "./slae-display";
import { useMatrixStore } from "@/store/matrix";

const InverseMethodSlae = ({
  matrix,
  isLoadingMatrix,
  currentTargetRow,
}: {
  matrix: number[][];
  isLoadingMatrix: boolean;
  currentTargetRow: number;
}) => {
  const matrixState = useMatrixStore((state) => state.matrixConfiguration);

  const [inverseMethodMatrixView, setInverseMethodMatrixView] = useState<
    "matrix" | "inverse"
  >("matrix");

  const toggleInverseMethodMatrixView = () => {
    setInverseMethodMatrixView((prev) =>
      prev === "matrix" ? "inverse" : "matrix"
    );
  };
  return (
    <>
      <Button onClick={toggleInverseMethodMatrixView}>
        {inverseMethodMatrixView === "matrix" ? "View Inverse" : "View Matrix"}
      </Button>
      {inverseMethodMatrixView === "matrix" ? (
        <SlaeDisplay
          matrix={
            matrixState?.type === "inverse" ? matrixState.inverse : matrix
          }
          isLoadingMatrix={isLoadingMatrix}
          currentTargetRow={currentTargetRow}
        />
      ) : (
        <SlaeDisplay
          matrix={
            matrixState?.type === "inverse" ? matrixState.adjusted : matrix
          }
          isLoadingMatrix={isLoadingMatrix}
          currentTargetRow={currentTargetRow}
        />
      )}
    </>
  );
};

export default InverseMethodSlae;
