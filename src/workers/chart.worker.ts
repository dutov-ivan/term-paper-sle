import { SlaeMatrix } from "@/lib/math/slae-matrix";
import {
  createSolutionMethodFromType,
  type MethodType,
} from "@/lib/methods/IMethod";
import type { MethodMetadata } from "@/lib/methods/Method";
import { expose } from "comlink";

export type ChartWorker = {
  runOneTillEndWithCallback: (
    methodType: MethodType,
    size: number,
    timesPerSize: number,
    generationOptions: SlaeGenerationOptions,
    onStep: (stepResult: Stats) => void
  ) => Promise<void>;
  generateRandomMatrix(
    rows: number,
    cols: number,
    from: number,
    to: number
  ): number[][];

  terminate: () => void;
};

type SlaeGenerationOptions = {
  from: number;
  to: number;
};

export type ChartRunConfiguration = {
  method: MethodType;
  size: number;
  timesPerSize: number;
};

const chartWorker: ChartWorker = {
  runOneTillEndWithCallback: async (
    methodType: MethodType,
    size: number,
    timesPerSize: number,
    generationOptions: SlaeGenerationOptions,
    onStep: (stepResult: MethodMetadata) => void
  ) => {
    console.log(
      `Running method ${methodType} for size ${size} with ${timesPerSize} iterations`
    );
    for (let i = 0; i < timesPerSize; i++) {
      const matrix = SlaeMatrix.fromNumbers(
        chartWorker.generateRandomMatrix(
          size,
          size,
          generationOptions.from,
          generationOptions.to
        )
      );
      const method = createSolutionMethodFromType(methodType, matrix);
      const iterator = method.getForwardSteps();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const step of iterator) {
        continue;
      }
      method.backSubstitute();

      console.log("Results on webworker", method.methodMetadata);
      onStep(method.methodMetadata);
    }
  },

  generateRandomMatrix(
    rows: number,
    cols: number,
    from: number,
    to: number
  ): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        const randomValue = Math.random() * (to - from) + from;
        row.push(randomValue);
      }
      matrix.push(row);
    }
    return matrix;
  },
  terminate: () => {
    console.log("Chart worker terminated.");
    self.close();
  },
};

expose(chartWorker);
