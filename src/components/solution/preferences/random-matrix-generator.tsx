import { Button } from "@/components/ui/button";
import { DecimalMatrix } from "@/lib/math/DecimalMatrix";
import { generateRandomMatrix } from "@/lib/math/Matrix";
import { useMatrixStore } from "@/store/matrix";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type GenerationProperties = {
  from: number;
  to: number;
}

const RandomMatrixGenerator = () => {
  const size = useMatrixStore((state) => state.size);
  const setMatrix = useMatrixStore((state) => state.setMatrix);
  const setIsLoadingMatrix = useMatrixStore(
    (state) => state.setIsLoadingMatrix
  );
  const [generationProperties, setGenerationProperties] = useState<GenerationProperties>({
    from: 0,
    to: 100,
  })

  const setRandomMatrix = () => {
    if (size <= 0) {
      toast.error("Please set the matrix size first.");
      return;
    }
    setIsLoadingMatrix(true);
    setTimeout(async () => {
      try {
        const result = await invoke("generate_matrix", { ...generationProperties, rows: size, cols: size + 1 }) as number[][]
        setMatrix(result)
      } catch (err) {
        console.error("Error generating matrix:", err);
      }
      /*
      const decimalMatrix = DecimalMatrix.fromNumbers(
        randomMatrix.map((row) => row.map((value) => String(value)))
      );
      console.log("Decimal Matrix:", randomMatrix);
      setMatrix(decimalMatrix);
      setIsLoadingMatrix(false);
      */
    }, 0);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input value={generationProperties.from} onChange={(e) =>
        setGenerationProperties((prev) => ({
          ...prev,
          from: parseFloat(e.target.value)
        }))} placeholder="From" type="number" />
      <Input value={generationProperties.to} onChange={(e) =>
        setGenerationProperties((prev) => ({
          ...prev,
          to: parseFloat(e.target.value)
        }))} placeholder="From" type="number" />
      <Button onClick={() => setRandomMatrix()}>Generate Random Matrix</Button>
    </div>
  );
};

export default RandomMatrixGenerator;
