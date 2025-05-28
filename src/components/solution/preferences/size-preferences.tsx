import { Label } from "@/components/ui/label";
import { useMatrixStore } from "@/store/matrix";
import SizeInput from "./size-input";
import { useSolutionStore } from "@/store/solution";
import { useEffect } from "react";

const SizePreferences = () => {
  const matrix = useMatrixStore((state) => state.slae);
  const size = useMatrixStore((state) => state.slae?.length ?? 0);
  const setSize = useMatrixStore((state) => state.resize);
  const worker = useSolutionStore((state) => state.worker);

  useEffect(() => {
    if (!matrix || matrix.length === 0) {
      return;
    }
    if (worker) {
      worker.setMatrix(matrix);
    }
  }, [size]);

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="size">Size</Label>
      <SizeInput size={matrix?.length ?? 0} setSize={setSize} />
    </div>
  );
};

export default SizePreferences;
