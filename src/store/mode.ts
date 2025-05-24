import { create } from "zustand";

type ModeStore = {
  mode: "solution" | "graphs";
  setMode: (mode: "solution" | "graphs") => void;
};

export const useModeStore = create<ModeStore>((set) => ({
  mode: "graphs",
  setMode: (mode) => set({ mode }),
}));
