import { create } from "zustand";

type ModeStore = {
  mode: "solution" | "graphs";
  setMode: (mode: "solution" | "graphs") => void;
};

export const useModeStore = create<ModeStore>((set) => ({
  mode: "solution",
  setMode: (mode) => set({ mode }),
}));
