import { create } from "zustand";

type MatrixState = {
  isLoadingMatrix: boolean;
  size: number;
  matrix: number[][];
  setMatrix: (matrix: number[][]) => void;

  resize: (newSize: number) => void;
  setIsLoadingMatrix: (isLoading: boolean) => void;
  getCell: (row: number, col: number) => number;
  setCell: (row: number, col: number, value: number) => void;
};

export const useMatrixStore = create<MatrixState>((set, get) => ({
  isLoadingMatrix: false,
  size: 0,
  matrix: [],


  resize: (newSize) => {
    const newMatrix = Array.from({ length: newSize }, () =>
      Array.from({ length: newSize + 1 }, () => 0));

    set({
      size: newSize,
      matrix: newMatrix,
    });
  },

  setIsLoadingMatrix: (isLoading) => set({ isLoadingMatrix: isLoading }),

  setMatrix: (matrix) =>
    set((state) => ({
      matrix: matrix,
      stringCache: new Map(),
      size: matrix.length,
    })),

  getCell: (row, col) => {
    const matrix = get().matrix;
    if (matrix.length === 0 || row < 0 || col < 0 || row >= matrix.length || col >= matrix[0].length) {
      throw new Error("Invalid row or column index");
    }
    return get().matrix[row][col];
  },

  setCell: (row, col, value) => {
    set((state) => {
      const newMatrix = state.matrix.map((r) => [...r]);
      newMatrix[row][col] = value;
      return {

      };
    });
  },
}));
