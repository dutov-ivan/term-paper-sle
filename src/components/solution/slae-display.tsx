import { useCallback, useEffect, useRef } from "react";
import SolutionCell from "@/components/solution/solution-cell.tsx";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "../ui/skeleton";
import { useMatrixStore } from "@/store/matrix";

const SlaeDisplay = ({
  matrix,
  isLoadingMatrix,
  currentTargetRow,
  emptyText,
  isEnterable,
  isRunning,
  setCell,
}: {
  matrix?: number[][] | null;
  isLoadingMatrix: boolean;
  currentTargetRow: number | null;
  emptyText?: string;
  isEnterable: boolean;
  isRunning: boolean;
  setCell: ((row: number, column: number, value: number) => void) | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rows = matrix ? matrix.length : 0;
  const columns = matrix && matrix.length !== 0 ? matrix[0].length : 0;

  const wasUpdated = useMatrixStore((state) => state.wasUpdated);
  const getScrollElement = useCallback(() => containerRef.current, []);

  const columnVirtualizer = useVirtualizer({
    count: columns,
    horizontal: true,
    getScrollElement,
    estimateSize: () => 150,
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
  }, [currentTargetRow, rowVirtualizer]);

  useEffect(() => {
    // If it stopped updating, reset the scroll position
    if (!wasUpdated) {
      rowVirtualizer.scrollToIndex(0, { align: "start" });
      columnVirtualizer.scrollToIndex(0, { align: "start" });
    }
  }, [wasUpdated, rowVirtualizer, columnVirtualizer]);

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

  return !matrix || matrix.length === 0 ? (
    <div className="w-full h-full flex items-center justify-center text-lg text-muted-foreground">
      {emptyText || "Create a matrix to get started!"}
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
                    isRunning={isRunning}
                    setCell={setCell}
                    isEnterable={isEnterable}
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
