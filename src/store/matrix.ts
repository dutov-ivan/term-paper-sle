import { create } from "zustand";
import { SlaeMatrix } from "@/lib/math/slae-matrix";

export type MatrixState = {
  isLoadingMatrix: boolean;
  matrix: number[][] | null;
  resize: (newSize: number) => void;
  setIsLoadingMatrix: (isLoading: boolean) => void;
  setMatrix: (matrix: number[][]) => void;
  setMatrixCell: (row: number, col: number, value: number) => void;
  currentTargetRow: number | null;
  setCurrentTargetRow: (row: number | null) => void;
};

export const useMatrixStore = create<MatrixState>((set) => ({
  isLoadingMatrix: false,
  matrix: null,

  resize: (size: number) => {
    set({
      matrix: new Array(size).fill(0).map(() => new Array(size + 1).fill(0)),
    });
  },
  setIsLoadingMatrix: (isLoading) => set({ isLoadingMatrix: isLoading }),
  setMatrix: (contents: number[][]) => set({ matrix: contents }),
  setMatrixCell: (row, col, value) =>
    set((state) => {
      if (!state.matrix) return {};
      state.matrix[row][col] = value;
      return { matrix: state.matrix.map((r) => [...r]) };
    }),
  setCurrentTargetRow: (row) => set({ currentTargetRow: row }),
  currentTargetRow: null,
}));
