import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartDataEntry, ChartGroup } from "./chart";

export function AlgorithmChart({
  chartGroup,
  chartData,
  valueKey = "elementaryOperations",
}: {
  chartGroup: ChartGroup;
  chartData: ChartDataEntry[];
  valueKey?: "elementaryOperations" | "iterations" | "backSubstitution";
}) {
  const processedData = chartData.map((entry) => {
    const entryRecord = entry as Record<string, number>;
    const newEntry: { [key: string]: number } = { size: entry.size };
    Object.keys(chartGroup).forEach((method) => {
      if (valueKey === "elementaryOperations") {
        newEntry[method] = entryRecord[method];
      } else if (valueKey === "iterations") {
        newEntry[method] = entryRecord[method + "_iterations"];
      } else if (valueKey === "backSubstitution") {
        newEntry[method] = entryRecord[method + "_backSubstitution"];
      }
    });
    return newEntry;
  });

  return (
    <div>
      <ChartContainer config={chartGroup}>
        <LineChart data={processedData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="size"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {Object.entries(chartGroup).map(([method, config]) => (
            <Line
              key={method}
              dataKey={method}
              type="monotone"
              stroke={config.color}
              name={config.label}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
