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
import { useSolutionWorkerStore } from "@/store/solutionWorker";

type GenerationProperties = {
  from: number;
  to: number;
};

const RandomMatrixGenerator = () => {
  const setIsLoadingMatrix = useMatrixStore(
    (state) => state.setIsLoadingMatrix
  );
  const setSlae = useMatrixStore((state) => state.setSlae);
  const [generationProperties, setGenerationProperties] =
    useState<GenerationProperties>({
      from: 0,
      to: 100,
    });
  const matrix = useMatrixStore((state) => state.slae);
  const [open, setOpen] = useState(false);
  const worker = useSolutionWorkerStore((state) => state.worker);
  console.log("Worker in RandomMatrixGenerator:", worker);

  const setRandomMatrix = async () => {
    if (!matrix) {
      toast.error("Please set the matrix size first.");
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
        generationProperties.from,
        generationProperties.to
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
            value={generationProperties.from}
            onChange={(e) =>
              setGenerationProperties((prev) => ({
                ...prev,
                from: parseFloat(e.target.value),
              }))
            }
            placeholder="From"
            type="number"
          />
          <Input
            value={generationProperties.to}
            onChange={(e) =>
              setGenerationProperties((prev) => ({
                ...prev,
                to: parseFloat(e.target.value),
              }))
            }
            placeholder="To"
            type="number"
          />
        </div>
        <DialogFooter>
          <Button onClick={setRandomMatrix}>Generate</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RandomMatrixGenerator;
