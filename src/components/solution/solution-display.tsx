import React, { useRef, useLayoutEffect, useState } from "react";
import SolutionCell from "@/components/solution/solution-cell.tsx";
import { useVirtualizer } from "@tanstack/react-virtual";

function SolutionDisplay({
  matrix,
  setMatrix,
}: {
  matrix: number[][];
  setMatrix: React.Dispatch<React.SetStateAction<number[][]>>;
}) {
  const setContents = (rowIndex: number, columnIndex: number) => {
    return function set(contents: number) {
      setMatrix((prev) =>
        prev.map((row, i) =>
          row.map((val, j) =>
            i === rowIndex && j === columnIndex ? contents : val
          )
        )
      );
    };
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // Horizontal column virtualizer
  const columnVirtualizer = useVirtualizer({
    count: matrix[0]?.length ?? 0,
    horizontal: true,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  // Vertical row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: matrix.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 68,
    overscan: 5,
  });

  const columnItems = columnVirtualizer.getVirtualItems();
  const rowItems = rowVirtualizer.getVirtualItems();

  const [before, after] =
    columnItems.length > 0
      ? [
          columnItems[0].start,
          columnVirtualizer.getTotalSize() -
            columnItems[columnItems.length - 1].end,
        ]
      : [0, 0];

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ width: "100%", height: "500px", position: "relative" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: `${columnVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowItems.map((row) => (
          <div
            key={row.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateY(${row.start}px)`,
              display: "flex",
            }}
          >
            <div style={{ width: `${before}px` }} />
            {columnItems.map((column) => (
              <div
                key={column.key}
                style={{
                  width: `${column.size}px`,
                  height: `${row.size}px`,
                  boxSizing: "border-box",
                }}
              >
                <SolutionCell
                  contents={matrix[row.index][column.index]}
                  columnIndex={column.index}
                  rowLength={matrix[0].length}
                  setContents={setContents(row.index, column.index)}
                />
              </div>
            ))}
            <div style={{ width: `${after}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SolutionDisplay;
