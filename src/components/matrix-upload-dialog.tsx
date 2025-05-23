import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { useImportModals } from "@/store/importModals";
import type { MatrixLoadingDialogType } from "@/lib/uploader";
import MatrixUploader from "./uploads/matrix-uploader";

type MatrixLoadingDialogProps = {
  type: MatrixLoadingDialogType;
};

const MatrixLoadingDialog = ({ type }: MatrixLoadingDialogProps) => {
  const setModal = useImportModals((state) => state.setModal);
  return (
    <Dialog onOpenChange={(open) => !open && setModal(null)} defaultOpen>
      <DialogContent>
        <DialogTitle>Loading {type} Matrix</DialogTitle>
        <DialogDescription>
          This is a loading dialog for {type} matrix It will show up when you
          are loading a matrix from {type} file
        </DialogDescription>
        <MatrixUploader type={type} />
      </DialogContent>
    </Dialog>
  );
};

export default MatrixLoadingDialog;
