import React, { useState } from "react";
import { MethodType } from "@/lib/methods/IMethod";
import { methodToString } from "../solution/preferences/method";
import { MultiSelector } from "../ui/multi-selector";
import { Input } from "../ui/input";
import { AlgorithmChart } from "./algorithm-chart";
import type { ChartDataEntry, ChartGroup } from "./chart";
import { Button } from "../ui/button";
import { createSolutionMethodFromType } from "@/lib/methods/IMethod";
import { generateRandomMatrix } from "@/lib/math/Matrix";

const ChartGenerator = () => {
  const [methods, setMethods] = useState<MethodType[]>([]);
  const [methodToAdd, setMethodToAdd] = useState<MethodType | null>(null);

  const [sizes, setSizes] = useState<number[]>([]);
  const [sizeToAdd, setSizeToAdd] = useState<number | null>(null);

  const [timesPerSize, setTimesPerSize] = useState<number>(1);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wasGenerating, setWasGenerating] = useState<boolean>(false);
  const [chartGroup, setChartGroup] = useState<ChartGroup>();
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);

  async function startGeneration() {
    setIsGenerating(true);
    setWasGenerating(true);

    // Build chartGroup mapping methods to labels/colors
    const chartGroup: ChartGroup = {};
    for (const method of methods) {
      chartGroup[method] = {
        label: methodToString[method],
        color: getRandomColor(),
      };
    }
    setChartGroup(chartGroup);

    // Prepare chartData array
    const newChartData: ChartDataEntry[] = [];

    for (const size of sizes) {
      const data: ChartDataEntry = { size };

      for (let j = 0; j < timesPerSize; j++) {
        const matrix = generateRandomMatrix(size);

        for (const methodType of methods) {
          const method = createSolutionMethodFromType(methodType);
          const runner = method.run(matrix);
          let result = runner.next();
          while (!result.done) {
            result = runner.next();
          }
          // Accumulate elementaryOperations for the method
          data[methodType] =
            (data[methodType] ?? 0) + method.elementaryOperations;
        }
      }

      newChartData.push(data);
    }

    setChartData(newChartData);
    setIsGenerating(false);
  }

  // Helper: generate a random hex color string like "#A1B2C3"
  function getRandomColor(): string {
    return (
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex gap-4">
        <MultiSelector<MethodType>
          title="Methods"
          selectedItems={methods}
          allItems={Object.keys(methodToString) as MethodType[]}
          itemToAdd={methodToAdd}
          setItemToAdd={setMethodToAdd}
          setSelectedItems={setMethods}
          toString={(m: MethodType) => methodToString[m]}
        />

        <MultiSelector<number>
          title="Sizes"
          selectedItems={sizes}
          allItems={[10, 100, 1000, 10000]}
          itemToAdd={sizeToAdd}
          setItemToAdd={setSizeToAdd}
          setSelectedItems={setSizes}
          toString={(s: number) => s.toString()}
        />
        <div>
          <span className="text-sm text-muted-foreground">Times per size:</span>
          <Input
            type="number"
            value={timesPerSize}
            onChange={(e) => setTimesPerSize(Number(e.target.value))}
            placeholder="Times per size"
            className="w-48"
          />
        </div>
        <Button onClick={startGeneration}>Generate</Button>
      </div>
      <div className="w-1/3">
        {wasGenerating && chartGroup && (
          <AlgorithmChart chartGroup={chartGroup} chartData={chartData} />
        )}
      </div>
    </div>
  );
};

export default ChartGenerator;
