import { DecimalMatrix } from "@/lib/math/DecimalMatrix";
import type { Step } from "@/lib/steps/Step";
import Decimal from "decimal.js";
import type { string } from "zod";
import { create } from "zustand";

type MatrixState = {
  decimalMatrix: DecimalMatrix;
  isLoadingMatrix: boolean;
  size: number;

  resize: (newSize: number) => void;
  setIsLoadingMatrix: (isLoading: boolean) => void;
  getCellString: (row: number, col: number) => string;
  setCell: (row: number, col: number, value: string) => void;
  getStringMatrix: () => string[][];

  executeStep: (step: Step) => void;
  setDecimalMatrix: (dm: DecimalMatrix) => void;
  stringCache: Map<string, string>;
  version: number;
};

export const useMatrixStore = create<MatrixState>((set, get) => ({
  decimalMatrix: new DecimalMatrix(0, 0),
  isLoadingMatrix: false,
  size: 0,
  version: 0,

  resize: (newSize) => {
    const newDecimalMatrix = new DecimalMatrix(newSize, newSize + 1);
    set({
      size: newSize,
      decimalMatrix: newDecimalMatrix,
    });
  },

  setIsLoadingMatrix: (isLoading) => set({ isLoadingMatrix: isLoading }),

  getStringMatrix: () => {
    const { decimalMatrix, size } = get();
    return Array.from({ length: size }, (_, i) =>
      Array.from({ length: size + 1 }, (_, j) =>
        decimalMatrix.get(i, j).toString()
      )
    );
  },

  setDecimalMatrix: (dm) =>
    set((state) => ({
      decimalMatrix: dm,
      version: state.version + 1,
      stringCache: new Map(),
      size: dm.rows,
    })),
  stringCache: new Map(),

  setCell: (row, col, value) => {
    set((state) => {
      state.decimalMatrix.set(row, col, new Decimal(value));
      const key = `${row},${col}`;
      state.stringCache.set(key, value);
      return {
        version: state.version + 1,
      };
    });
  },

  getCellString: (row, col) => {
    const key = `${row},${col}`;
    const cache = get().stringCache;
    if (cache.has(key)) return cache.get(key)!;

    const val = get().decimalMatrix.get(row, col).toString();
    cache.set(key, val);
    return val;
  },

  executeStep: (step) => {
    set((state) => {
      step.perform(state.decimalMatrix);
      state.stringCache.clear();
      return {
        version: state.version + 1,
      };
    });
  },
}));
