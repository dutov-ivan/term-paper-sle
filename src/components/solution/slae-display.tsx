import { useCallback, useEffect, useRef } from "react";
import SolutionCell from "@/components/solution/solution-cell.tsx";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "../ui/skeleton";

const SlaeDisplay = ({
  matrix,
  isLoadingMatrix,
  currentTargetRow,
}: {
  matrix?: number[][] | null;
  isLoadingMatrix: boolean;
  currentTargetRow: number | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rows = matrix ? matrix.length : 0;
  const columns = matrix ? matrix[0].length : 0;

  const getScrollElement = useCallback(() => containerRef.current, []);

  const columnVirtualizer = useVirtualizer({
    count: columns,
    horizontal: true,
    getScrollElement,
    estimateSize: () => 120,
    overscan: 5,
  });

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement,
    estimateSize: () => 50,
    overscan: 5,
  });

  useEffect(() => {
    if (currentTargetRow === null || currentTargetRow < 0) return;
    rowVirtualizer.scrollToIndex(currentTargetRow, {
      behavior: "smooth",
      align: "center",
    });
  }, [currentTargetRow]);

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

  return !matrix ? (
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
                    contents={matrix[row.index][column.index]}
                    rowIndex={row.index}
                    columnIndex={column.index}
                    rowLength={columns}
                    matrix={matrix}
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
