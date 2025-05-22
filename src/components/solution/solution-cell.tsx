import { GridCell } from "@/components/ui/grid";
import { Input } from "@/components/ui/input.tsx";
import { useSafeNumericInput } from "@/hooks/useSafeNumericInput.ts";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { clsx } from "clsx";

interface SolutionCellProps {
  contents: number;
  rowLength: number;
  setContents: (cell: number) => void;
  columnIndex: number;
}

function SolutionCell({
  contents,
  columnIndex,
  rowLength,
  setContents,
}: SolutionCellProps) {
  const isEnding = columnIndex === rowLength - 1;
  const isStarting = columnIndex === 0;
  const coefficient = `x_{${columnIndex + 1}}`;
  const changeContents = useSafeNumericInput(setContents);

  // Use string value for input, allow incomplete input
  const inputValue = String(contents);
  // Calculate width: 1ch per char, plus a little extra for padding/cursor
  const charCount = inputValue.length > 0 ? inputValue.length : 1;
  const inputWidth = `calc(${charCount}ch + 1.5rem)`; // 1.5rem for padding/cursor
  const minWidth = "48px";
  const maxWidth = "140px";

  return (
    <div
      className="flex items-center justify-center p-1"
      style={{
        width: "120px",
        height: "50px",
        boxSizing: "border-box",
      }}
    >
      <div className="flex items-center justify-between w-full h-full px-2">
        <div className="flex items-center gap-1">
          {!isStarting && <span>{isEnding ? "=" : "+"}</span>}
          <Input
            className="w-full text-[1.125rem] px-2"
            value={inputValue}
            onChange={changeContents}
          />
        </div>
        {!isEnding && (
          <div className="flex items-center gap-1">
            <InlineMath math="\cdot" />
            <InlineMath math={coefficient} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SolutionCell;
