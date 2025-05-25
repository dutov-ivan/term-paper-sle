import { create } from "zustand";
import { SlaeMatrix } from "@/lib/math/slae-matrix";

export type MatrixState = {
  isLoadingMatrix: boolean;
  matrix: SlaeMatrix | null;
  resize: (newSize: number) => void;
  setIsLoadingMatrix: (isLoading: boolean) => void;
  setMatrix: (matrix: number[][]) => void;
  setMatrixCell: (row: number, col: number, value: number) => void;
};

export const useMatrixStore = create<MatrixState>((set) => ({
  isLoadingMatrix: false,
  matrix: null,

  resize: (size: number) => {
    set({ matrix: new SlaeMatrix(size) });
  },
  setIsLoadingMatrix: (isLoading) => set({ isLoadingMatrix: isLoading }),
  setMatrix: (contents: number[][]) =>
    set({ matrix: SlaeMatrix.fromNumbers(contents) }),
  setMatrixCell: (row, col, value) =>
    set((state) => {
      if (!state.matrix) return {};
      state.matrix.set(row, col, value);
      // To trigger update, create a new reference
      return { matrix: state.matrix };
    }),
}));
