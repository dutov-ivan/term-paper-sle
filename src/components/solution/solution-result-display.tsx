import type { SolutionResult } from "@/lib/solution/SolutionResult";
import { SolutionResultType } from "@/lib/solution/SolutionResultType";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const ROW_HEIGHT = 36;

const SolutionResultDisplay = ({ result }: { result: SolutionResult }) => {
  const roots = result?.roots || [];
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: roots.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>
          <span className="text-primary font-bold text-lg">
            {result.result === SolutionResultType.Unique && "Unique Solution"}
            {result.result === SolutionResultType.Infinite &&
              "Infinite Solutions"}
            {result.result === SolutionResultType.None && "No Solution"}
            {result.result === SolutionResultType.NoneOrInfinite &&
              "No or Infinite Solutions"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {roots.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Roots</h3>
            <div
              ref={parentRef}
              className="overflow-x-auto overflow-y-auto border rounded"
              style={{ maxHeight: "60vh", minHeight: 80, position: "relative" }}
            >
              <table className="min-w-[200px] text-sm w-full">
                <thead className="sticky top-0 bg-muted z-10">
                  <tr>
                    <th className="px-3 py-2 text-left bg-muted text-muted-foreground">
                      Index
                    </th>
                    <th className="px-3 py-2 text-left bg-muted text-muted-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    position: "relative",
                    display: "block",
                    height: rowVirtualizer.getTotalSize(),
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const i = virtualRow.index;
                    return (
                      <tr
                        key={i}
                        className={"even:bg-muted/50"}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <td className="px-3 py-2 font-mono">{i + 1}</td>
                        <td className="px-3 py-2 font-mono">
                          {roots[i].toFixed(12)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {result.description && (
          <div className="bg-muted rounded p-4 text-sm text-muted-foreground">
            {result.description}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolutionResultDisplay;
