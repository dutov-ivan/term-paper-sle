import { create } from "zustand";

type ImportModalType = "CSV" | "Excel" | "JSON" | "TXT" | null;

type ModalStore = {
  openedModal: ImportModalType;
  setModal: (modal: ImportModalType) => void;
};

export const useImportModals = create<ModalStore>((set) => ({
  openedModal: null,
  setModal: (modal) => set({ openedModal: modal }),
}));
