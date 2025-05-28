import { useEffect, useRef, useState } from "react";
import { MethodType } from "@/lib/methods/IMethod";
import { methodToString } from "../solution/preferences/method";
import { MultiSelector } from "../ui/multi-selector";
import { Input } from "../ui/input";
import { AlgorithmChart } from "./algorithm-chart";
import type { ChartDataEntry, ChartGroup } from "./chart";
import { Button } from "../ui/button";
import { createChartWorker } from "@/workers/chart.worker-wrapper";
import { proxy } from "comlink";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

const ChartGenerator = () => {
  const [methods, setMethods] = useState<MethodType[]>([
    "Gauss",
    "GaussJordan",
    "InverseMatrix",
  ]);
  const [methodToAdd, setMethodToAdd] = useState<MethodType | null>(null);

  const [sizes, setSizes] = useState<number[]>([10, 100]);
  const [sizeToAdd, setSizeToAdd] = useState<number | null>(null);

  const [timesPerSize, setTimesPerSize] = useState<number>(1);

  const [, setIsGenerating] = useState<boolean>(false);
  const [wasGenerating, setWasGenerating] = useState<boolean>(false);
  const [chartGroup, setChartGroup] = useState<ChartGroup>();
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);
  const workerRef = useRef<ReturnType<typeof createChartWorker> | null>(null);

  useEffect(() => {
    // Initialize the worker
    workerRef.current = createChartWorker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  async function startGeneration() {
    if (!workerRef.current) {
      toast.error("Worker is not initialized");
      return;
    }

    setIsGenerating(true);
    setWasGenerating(true);
    console.log("Starting generation...");

    const chartGroup: ChartGroup = {};
    for (const method of methods) {
      chartGroup[method] = {
        label: methodToString[method],
        color: getRandomColor(),
      };
    }
    setChartGroup(chartGroup);

    const newChartData: ChartDataEntry[] = [];
    const workerApi = workerRef.current;

    for (const size of sizes) {
      const data: ChartDataEntry & Record<string, number> = { size };

      const promises = methods.map((methodType) => {
        return new Promise<void>((resolve) => {
          let totalOps = 0;
          let totalIterations = 0;
          let totalBackSub = 0;
          let callbackCount = 0;

          const callback = proxy(
            (result: {
              elementaryOperations: number;
              iterations: number;
              backSubstitutionOperations?: number;
            }) => {
              totalOps += result.elementaryOperations;
              totalIterations += result.iterations;
              if (typeof result.backSubstitutionOperations === "number") {
                totalBackSub += result.backSubstitutionOperations;
              }
              callbackCount++;

              if (callbackCount >= timesPerSize) {
                data[methodType] = totalOps / timesPerSize;
                data[methodType + "_iterations"] =
                  totalIterations / timesPerSize;
                data[methodType + "_backSubstitution"] =
                  totalBackSub / timesPerSize;
                resolve();
              }
            }
          );

          workerApi.runOneTillEndWithCallback(
            methodType,
            size,
            timesPerSize,
            callback
          );
        });
      });

      await Promise.all(promises).then(() => {
        newChartData.push(data);
      });
    }

    console.log("Final chart data:", newChartData);
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
    <div className="flex gap-4 h-full overflow-y-auto">
      <div className="flex flex-col gap-4 w-1/3 min-w-[320px] h-full">
        <div className="bg-card p-4 rounded-lg shadow flex flex-col gap-4 h-full">
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
            allItems={[10, 100, 200, 500, 1000]}
            itemToAdd={sizeToAdd}
            setItemToAdd={setSizeToAdd}
            setSelectedItems={setSizes}
            toString={(s: number) => s.toString()}
          />
          <div>
            <span className="text-sm text-muted-foreground">
              Times per size:
            </span>
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
      </div>
      <div className="flex-1 h-full overflow-y-auto max-w-[800px]">
        {wasGenerating && chartGroup && (
          <div className="bg-card p-4 rounded-lg shadow  overflow-y-auto flex flex-col gap-4">
            <div className="min-h-[160px]">
              <h3 className="text-lg font-semibold mb-2">
                Elementary Operations
              </h3>
              <AlgorithmChart chartGroup={chartGroup} chartData={chartData} />
            </div>
            <Separator />
            <div className="min-h-[160px]">
              <h3 className="text-lg font-semibold mb-2">Iterations</h3>
              <AlgorithmChart
                chartGroup={chartGroup}
                chartData={chartData}
                valueKey="iterations"
              />
            </div>
            <Separator />
            <div className="min-h-[160px]">
              <h3 className="text-lg font-semibold mb-2">
                Back Substitution Operations
              </h3>
              <AlgorithmChart
                chartGroup={chartGroup}
                chartData={chartData}
                valueKey="backSubstitution"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartGenerator;
