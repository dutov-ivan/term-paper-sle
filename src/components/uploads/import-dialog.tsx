import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useMatrixStore } from "@/store/matrix";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { parserWorker } from "@/workers/parser.worker-wrapper";
import { useSolutionStore } from "@/store/solution";

type MatrixLoadingDialogProps = {
  open: boolean;
  setOpen: (isOpened: boolean) => void;
};

const ImportDialog = ({ open, setOpen }: MatrixLoadingDialogProps) => {
  const setSlae = useMatrixStore((state) => state.setSlae);
  const solutionWorker = useSolutionStore((state) => state.worker);
  const resize = useMatrixStore((state) => state.resize);
  const setLoadingMatrix = useMatrixStore((state) => state.setIsLoadingMatrix);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!solutionWorker) {
      toast.error("Solution worker is not initialized");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingMatrix(true);
      const data = await parserWorker.parse(file);
      resize(data.length);
      setSlae(data);
      await solutionWorker.setMatrix(data);
      toast.success("Matrix loaded successfully");
      setOpen(false);
    } catch (error) {
      console.error("Worker error:", error);
      toast.error("Error loading matrix: " + (error as Error).message);
    } finally {
      setLoadingMatrix(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogContent>
        <DialogTitle>Loading Matrix</DialogTitle>
        <DialogDescription>
          This is a loading dialog for CSV matrix It will show up when you are
          loading a matrix from CSV file
        </DialogDescription>
        <Input type="file" accept=".csv" onChange={handleFileChange} />
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
