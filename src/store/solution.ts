import { type MethodType } from "@/lib/methods/IMethod";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import { create } from "zustand";

type SolutionState = {
  method: MethodType | null;
  setMethod: (method: MethodType) => void;
  solutionResult: SolutionResult | null;
  setSolutionResult: (result: SolutionResult | null) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
};

export const useSolutionStore = create<SolutionState>((set) => ({
  method: null,
  setMethod: (method: MethodType) =>
    set({
      method: method,
      currentStepIndex: 0,
      solutionResult: null,
    }),
  solutionResult: null,
  setSolutionResult: (result) => set({ solutionResult: result }),
  currentStepIndex: 0,
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
}));
