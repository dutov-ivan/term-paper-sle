import { Input } from "@/components/ui/input.tsx";
import { useSafeNumericInput } from "@/hooks/use-safe-numeric-input";
import { displayNumber, MAX_AFTER_DOT } from "@/lib/math/utils";
import { cn } from "@/lib/utils";
import { useMatrixStore } from "@/store/matrix";
import { useEffect } from "react";
import { toast } from "sonner";

interface SolutionCellProps {
  rowIndex: number;
  columnIndex: number;
  rowLength: number;
  contents: number;
  matrix: number[][] | null;
  isRunning: boolean;
  isEnterable: boolean;
  setCell: ((row: number, column: number, value: number) => void) | null;
}

function SolutionCell({
  columnIndex,
  rowIndex,
  rowLength,
  contents,
  matrix,
  isRunning,
  setCell,
  isEnterable,
}: SolutionCellProps) {
  const isEnding = columnIndex === rowLength - 1;
  const isStarting = columnIndex === 0;
  const addInvalidCell = useMatrixStore((state) => state.addInvalidCell);

  const removeInvalidCell = useMatrixStore((state) => state.removeInvalidCell);

  const { safeInput, onSafeInputChange, isValid } = useSafeNumericInput(
    contents,
    (num) => {
      if (isRunning) {
        toast.error("Cannot change cell value while running.");
        return;
      }
      if (!matrix) return;
      if (setCell) {
        const rounded = Number(num.toFixed(MAX_AFTER_DOT));
        setCell(rowIndex, columnIndex, rounded);
      }
    }
  );

  useEffect(() => {
    if (!isValid) {
      addInvalidCell(rowIndex, columnIndex);
    } else {
      removeInvalidCell(rowIndex, columnIndex);
    }
  }, [isValid, rowIndex, columnIndex, addInvalidCell, removeInvalidCell]);

  return (
    <div className="flex w-full items-center justify-center gap-2 p-2">
      <div className="flex items-center gap-1">
        {!isStarting && (
          <span className="latex-symbol">{isEnding ? "=" : "+"}</span>
        )}
        {isEnterable ? (
          <Input
            disabled={isRunning}
            className={cn(
              "min-w-12",
              !isValid &&
                "border-red-500 ring-red-500 focus:ring-red-500 focus:border-red-500"
            )}
            value={safeInput}
            onChange={(e) => onSafeInputChange(e.target.value)}
          />
        ) : (
          <span>{displayNumber(contents)}</span>
        )}
      </div>
      {!isEnding && (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <span style={{ verticalAlign: "middle" }}>&middot;</span>
          <span>
            x<sub>{columnIndex + 1}</sub>
          </span>
        </span>
      )}
    </div>
  );
}

export default SolutionCell;
