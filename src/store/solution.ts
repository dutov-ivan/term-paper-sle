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
};

export const useSolutionStore = create<SolutionState>((set) => ({
  method: null,
  setMethod: (method: MethodType) =>
    set({ method: createSolutionMethodFromType(method) }),
  solutionResult: null,
  setSolutionResult: (result) => set({ solutionResult: result }),
}));
