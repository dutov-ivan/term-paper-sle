import { Input } from "@/components/ui/input.tsx";
import { useSafeNumericInput } from "@/hooks/useSafeNumericInput.ts";
import "katex/dist/katex.min.css";
import { useMatrixStore } from "@/store/matrix";

interface SolutionCellProps {
  rowIndex: number;
  columnIndex: number;
  rowLength: number;
  contents: string;
}

function SolutionCell({
  columnIndex,
  rowIndex,
  rowLength,
  contents,
}: SolutionCellProps) {
  const isEnding = columnIndex === rowLength - 1;
  const isStarting = columnIndex === 0;
  const setContents = useMatrixStore((state) => state.setCell);

  const { value, onChange: onValueChange } = useSafeNumericInput(
    Number(contents),
    (num) => setContents(rowIndex, columnIndex, num.toString())
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
          <Input
            className="latex-input"
            style={{ width: inputWidth, minWidth: "48px" }}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
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
