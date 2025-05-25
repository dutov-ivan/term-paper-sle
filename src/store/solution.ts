import {
  createSolutionMethodFromType,
  type IMethod,
  type MethodType,
} from "@/lib/methods/IMethod";
import type { SolutionResult } from "@/lib/solution/SolutionResult";
import type { Step } from "@/lib/steps/Step";
import { create } from "zustand";

type SolutionState = {
  method: IMethod | null;
  setMethod: (method: MethodType) => void;
  solutionResult: SolutionResult | null;
  setSolutionResult: (result: SolutionResult | null) => void;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  resetSteps: () => void;
};

export const useSolutionStore = create<SolutionState>((set) => ({
  method: null,
  setMethod: (method: MethodType) =>
    set({
      method: createSolutionMethodFromType(method),
      steps: [],
      currentStepIndex: 0,
      solutionResult: null,
    }),
  solutionResult: null,
  setSolutionResult: (result) => set({ solutionResult: result }),
  steps: [],
  setSteps: (steps) => set({ steps }),
  currentStepIndex: 0,
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  resetSteps: () => set({ steps: [], currentStepIndex: 0 }),
}));
