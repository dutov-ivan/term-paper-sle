import { create } from "zustand";

type ModeStore = {
  mode: "solution" | "charts";
  setMode: (mode: "solution" | "charts") => void;
};

export const useModeStore = create<ModeStore>((set) => ({
  mode: "charts",
  setMode: (mode) => set({ mode }),
}));
