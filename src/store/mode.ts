import { create } from "zustand";

type ModeStore = {
  mode: "solution" | "charts";
  setMode: (mode: "solution" | "charts") => void;
};

export const useModeStore = create<ModeStore>((set) => ({
  mode: "solution",
  setMode: (mode) => set({ mode }),
}));
