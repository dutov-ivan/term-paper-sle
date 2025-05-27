import { wrap } from "comlink";
import Worker from "@/workers/solution.worker.ts?worker";
import type { SolutionWorker } from "./solution.worker";

export const createSolutionWorker = () => {
  return wrap<SolutionWorker>(new Worker());
};
