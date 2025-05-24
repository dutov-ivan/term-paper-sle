import React from "react";
import { useRef } from "react";
import SolutionCell from "@/components/solution/solution-cell.tsx";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "../ui/skeleton";
import { useMatrixStore } from "@/store/matrix";

const SlaeDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useMatrixStore((state) => state.size);
  const rows = size;
  const columns = rows === 0 ? 0 : size + 1;
  const matrix = useMatrixStore((state) => state.decimalMatrix);
  const isLoadingMatrix = useMatrixStore((state) => state.isLoadingMatrix);
  const getCellString = useMatrixStore((state) => state.getCellString);

  // Horizontal column virtualizer
  const columnVirtualizer = useVirtualizer({
    count: columns,
    horizontal: true,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  // Vertical row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 50,
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

  return rows === 0 ? (
    <div className="w-full h-full flex items-center justify-center text-lg text-muted-foreground">
      Create a matrix to get started!
    </div>
  ) : (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ width: "100%", height: "100%", position: "relative" }}
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
                {isLoadingMatrix ? (
                  <Skeleton
                    key={`${row.index}-${column.index}`}
                    className="absolute bg-muted rounded-md"
                    style={{
                      top: row.start + 4,
                      left: column.start + 4,
                      width: column.size - 8,
                      height: row.size - 8,
                    }}
                  />
                ) : (
                  <SolutionCell
                    contents={getCellString(row.index, column.index)}
                    rowIndex={row.index}
                    columnIndex={column.index}
                    rowLength={columns}
                  />
                )}
              </div>
            ))}
            <div style={{ width: `${after}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlaeDisplay;
