import {
  createSolutionMethodFromType,
  type IMethod,
  type MethodType,
} from "@/lib/methods/IMethod";
import { create } from "zustand";

type SolutionState = {
  method: IMethod | null;
  setMethod: (method: MethodType) => void;
};

export const useSolutionStore = create<SolutionState>((set) => ({
  method: null,
  setMethod: (method: MethodType) =>
    set({ method: createSolutionMethodFromType(method) }),
}));
