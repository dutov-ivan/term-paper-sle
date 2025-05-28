import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useMatrixStore } from "@/store/matrix";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dices } from "lucide-react";
import { useSolutionStore } from "@/store/solution";
import { useSafeNumericInput } from "@/hooks/use-safe-numeric-input";
import { MAX_AFTER_DOT } from "@/lib/math/utils";

const RandomMatrixGenerator = () => {
  const setIsLoadingMatrix = useMatrixStore(
    (state) => state.setIsLoadingMatrix
  );
  const setSlae = useMatrixStore((state) => state.setSlae);
  const matrix = useMatrixStore((state) => state.slae);
  const worker = useSolutionStore((state) => state.worker);
  const [open, setOpen] = useState(false);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(100);

  const {
    safeInput: fromInput,
    onSafeInputChange: onFromChange,
    isValid: isFromValid,
  } = useSafeNumericInput(from, (num) => setFrom(num), {
    mustBeInteger: false,
    checkValidPrecision: true,
  });

  const {
    safeInput: toInput,
    onSafeInputChange: onToChange,
    isValid: isToValid,
  } = useSafeNumericInput(to, (num) => setTo(num), {
    mustBeInteger: false,
    checkValidPrecision: true,
  });

  const setRandomMatrix = async () => {
    if (!matrix) {
      toast.error("Please set the matrix size first.");
      return;
    }

    if (from >= to) {
      toast.error("Invalid range: 'from' must be less than 'to'.");
      return;
    }

    setIsLoadingMatrix(true);
    try {
      if (!worker) {
        toast.error("Worker not initialized");
        setIsLoadingMatrix(false);
        return;
      }
      const result = await worker.generateRandomMatrix(
        matrix.length,
        matrix[0].length,
        from,
        to,
        MAX_AFTER_DOT
      );

      setSlae(result);
      await worker.setMatrix(result);
      setIsLoadingMatrix(false);
      setOpen(false);
    } catch (err) {
      setIsLoadingMatrix(false);
      console.error("Error generating matrix:", err);
      toast.error("Failed to generate matrix");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Dices />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Random Matrix</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            value={fromInput}
            onChange={(e) => onFromChange(e.target.value)}
            placeholder="From"
            type="text"
          />
          <Input
            value={toInput}
            onChange={(e) => onToChange(e.target.value)}
            placeholder="To"
            type="text"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={setRandomMatrix}
            disabled={!isFromValid || !isToValid}
          >
            Generate
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RandomMatrixGenerator;
