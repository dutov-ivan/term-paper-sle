import { create } from "zustand";

export type MatrixConfiguration =
  | { type: "standard"; matrix: number[][] }
  | { type: "inverse"; adjusted: number[][]; inverse: number[][] };

export type MatrixStore = {
  isLoadingMatrix: boolean;
  slae: number[][] | null;
  matrixConfiguration: MatrixConfiguration | null;
  resize: (newSize: number) => void;
  setIsLoadingMatrix: (isLoading: boolean) => void;
  setMatrix: (matrix: MatrixConfiguration) => void;
  setMatrixCell: (row: number, col: number, value: number) => void;
  currentTargetRow: number | null;
  setCurrentTargetRow: (row: number | null) => void;
};

export const useMatrixStore = create<MatrixStore>((set) => ({
  isLoadingMatrix: false,
  matrixConfiguration: null,
  slae: null,

  resize: (size: number) => {
    set(() => {
      const slae = new Array(size)
        .fill(0)
        .map(() => new Array(size + 1).fill(0));
      return {
        matrixConfiguration: {
          type: "standard",
          matrix: slae,
        },
        slae,
      };
    });
  },
  setIsLoadingMatrix: (isLoading) => set({ isLoadingMatrix: isLoading }),
  setMatrix: (matrix: MatrixConfiguration) =>
    set(() => {
      if (matrix.type === "standard") {
        return { matrixConfiguration: matrix, slae: matrix.matrix };
      }
      // Inverse state goes to inverse place
      return { matrixConfiguration: matrix };
    }),
  setMatrixCell: (row, col, value) =>
    set((state) => {
      if (!state.matrixConfiguration) return {};
      if (state.matrixConfiguration.type !== "standard") return {};

      state.matrixConfiguration.matrix[row][col] = value;
      return { matrixConfiguration: state.matrixConfiguration };
    }),
  setCurrentTargetRow: (row) => set({ currentTargetRow: row }),
  currentTargetRow: null,
}));
