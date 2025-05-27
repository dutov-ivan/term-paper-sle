import { Input } from "@/components/ui/input.tsx";
import { useSafeNumericInput } from "@/hooks/useSafeNumericInput.ts";
import "katex/dist/katex.min.css";
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

  const { value, onChange: onValueChange } = useSafeNumericInput(
    Number(contents.toFixed(12)),
    (num) => {
      if (isRunning) {
        toast.error("Cannot change cell value while running.");
      }

      if (!matrix) return;

      if (setCell) {
        console.log("Setting cell in solution:", rowIndex, columnIndex, num);
        setCell(rowIndex, columnIndex, num);
      }
    }
  );

  const charCount = value.length > 0 ? value.length : 1;
  const inputWidth = `min(calc(${charCount}ch + 1.2rem), 11ch)`;

  return (
    <div className="flex items-center justify-center p-1">
      <div className="flex items-center justify-between w-full h-full px-2">
        <div className="flex items-center gap-1">
          {!isStarting && (
            <span className="latex-symbol">{isEnding ? "=" : "+"}</span>
          )}
          {isEnterable ? (
            <Input
              disabled={isRunning || !isEnterable}
              className="latex-input"
              style={{ width: inputWidth, minWidth: "48px" }}
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
            />
          ) : (
            <span className="latex-symbol">{contents.toFixed(12)}</span>
          )}
        </div>
        {!isEnding && (
          <>
            <span className="latex-symbol">&middot;</span>
            <span className="latex-symbol">
              x<sub>{columnIndex + 1}</sub>
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default SolutionCell;
