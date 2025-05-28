import { wrap } from "comlink";
import Worker from "./chart.worker.ts?worker";
import type { ChartWorker } from "./chart.worker";

export const createChartWorker = () => {
  return wrap<ChartWorker>(new Worker());
};
