import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useMatrixStore } from "@/store/matrix";
import { Button } from "../ui/button";
import { toast } from "sonner";

type ExportDialogProps = {
  open: boolean;
  setIsOpen: (open: boolean) => void;
};

const ExportDialog = ({ open, setIsOpen }: ExportDialogProps) => {
  const matrix = useMatrixStore((state) => state.slae);

  const handleExport = () => {
    if (!matrix || matrix.length === 0) {
      toast.error("No matrix data to export.");
      return;
    }

    try {
      const csvContent = matrix.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "matrix.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Matrix exported successfully.");
      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export matrix.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle>Export Matrix</DialogTitle>
        <DialogDescription>
          Export the current matrix to a CSV file. Click the button below to
          download.
        </DialogDescription>
        <Button onClick={handleExport}>Download CSV</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
