import { create } from "zustand";

function generateRandomMatrix(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size + 1 }, () => Math.floor(Math.random() * 100))
  );
}

type MatrixState = {
  matrix: number[][];
  isLoadingMatrix: boolean;
  size: number;
  setSize: (newSize: number) => void;

  setMatrix: (matrix: number[][]) => void;
  setRandomMatrix: () => void;
  setIsLoadingMatrix: (isLoading: boolean) => void;
  setCell: (row: number, col: number, value: number) => void;
  getCell: (row: number, col: number) => number;
};

export const useMatrixStore = create<MatrixState>((set, get) => ({
  matrix: [],
  isLoadingMatrix: false,
  size: 0,
  setSize: (newSize: number) => {
    set((state) => {
      const oldMatrix = state.matrix;
      const rows = Array.from({ length: newSize }, (_, i) => {
        if (i < oldMatrix.length) {
          const oldRow = oldMatrix[i];
          if (oldRow.length === newSize + 1) return oldRow;
          if (oldRow.length < newSize + 1) {
            return [...oldRow, ...Array(newSize + 1 - oldRow.length).fill(0)];
          } else {
            return oldRow.slice(0, newSize + 1);
          }
        } else {
          return Array(newSize + 1).fill(0);
        }
      });
      return { matrix: rows, size: newSize, isLoadingMatrix: false };
    });
  },
  setMatrix: (matrix) => {
    set({ matrix });
  },
  setRandomMatrix: () => {
    set((state) => {
      const size = state.size;
      if (size <= 0) return { isLoadingMatrix: false };
      const randomMatrix = generateRandomMatrix(size);
      return { matrix: randomMatrix, isLoadingMatrix: false };
    });
  },
  setIsLoadingMatrix: (isLoading) => set({ isLoadingMatrix: isLoading }),

  setCell: (row, col, value) => {
    set((state) => {
      if (state.matrix[row][col] === value) return state; // No update if value is the same
      const newRow = [...state.matrix[row]];
      newRow[col] = value;
      const newMatrix = [...state.matrix];
      newMatrix[row] = newRow;
      return { matrix: newMatrix };
    });
  },

  getCell: (row, col) => get().matrix[row][col],
}));
