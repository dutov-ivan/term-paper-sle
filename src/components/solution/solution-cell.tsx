import { GridCell } from "@/components/ui/grid";
import { Input } from "@/components/ui/input.tsx";
import { useSafeNumericInput } from "@/hooks/useSafeNumericInput.ts";
import { InlineMath as RawInlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { clsx } from "clsx";
import React, { useState, useEffect, useRef } from "react";

const MemoizedInlineMath = React.memo(RawInlineMath);

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
  const { value, onChange: onValueChange } = useSafeNumericInput(
    contents,
    setContents
  );

  // Calculate width: 1ch per char, but clamp to a max of 12ch for visual consistency
  const charCount = value.length > 0 ? value.length : 1;
  const inputWidth = `min(calc(${charCount}ch + 1.2rem), 11ch)`;
  const minWidth = "48px";
  const maxWidth = undefined; // let the ch clamp handle it

  return (
    <div className="flex items-center justify-center p-1">
      <div className="flex items-center justify-between w-full h-full px-2">
        <div className="flex items-center gap-1">
          {!isStarting && <span>{isEnding ? "=" : "+"}</span>}
          <Input
            className="w-full text-[1.125rem] px-2"
            style={{ width: inputWidth, minWidth, maxWidth }}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </div>
        {!isEnding && (
          <div className="flex items-center gap-1">
            <MemoizedInlineMath math="\cdot" />
            <MemoizedInlineMath math={coefficient} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SolutionCell;
