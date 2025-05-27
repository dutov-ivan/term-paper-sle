import { create } from "zustand";
import { createSolutionWorker } from "@/workers/solution.worker-wrapper";

export type SolutionWorkerStore = {
  worker: ReturnType<typeof createSolutionWorker> | null;
  setWorker: (worker: ReturnType<typeof createSolutionWorker>) => void;
};

export const useSolutionWorkerStore = create<SolutionWorkerStore>((set) => ({
  worker: null,
  setWorker: (worker) => set({ worker }),
}));
