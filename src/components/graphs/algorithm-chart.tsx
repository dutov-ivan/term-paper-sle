"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartDataEntry, ChartGroup } from "./chart";

export function AlgorithmChart({
  chartGroup,
  chartData,
}: {
  chartGroup: ChartGroup;
  chartData: ChartDataEntry[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Performance</CardTitle>
        <CardDescription>By input size</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartGroup}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
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
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing algorithm timings by input size
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
