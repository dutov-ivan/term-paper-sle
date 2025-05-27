import { Button } from "@/components/ui/button";
import { useMatrixStore } from "@/store/matrix";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type GenerationProperties = {
  from: number;
  to: number;
};

const generateRandomMatrix = (
  rows: number,
  cols: number,
  from: number,
  to: number
): number[][] => {
  const matrix: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      const randomValue = Math.random() * (to - from) + from;
      row.push(randomValue);
    }
    matrix.push(row);
  }
  return matrix;
};

const RandomMatrixGenerator = () => {
  const setIsLoadingMatrix = useMatrixStore(
    (state) => state.setIsLoadingMatrix
  );
  const setMatrix = useMatrixStore((state) => state.setMatrix);
  const [generationProperties, setGenerationProperties] =
    useState<GenerationProperties>({
      from: 0,
      to: 100,
    });
  const matrix = useMatrixStore((state) => state.slae);

  const setRandomMatrix = () => {
    if (!matrix) {
      toast.error("Please set the matrix size first.");
      return;
    }
    setIsLoadingMatrix(true);
    setTimeout(async () => {
      try {
        const result = generateRandomMatrix(
          matrix.length,
          matrix[0].length,
          generationProperties.from,
          generationProperties.to
        );
        setMatrix({
          type: "standard",
          matrix: result,
        });
        setIsLoadingMatrix(false);
      } catch (err) {
        console.error("Error generating matrix:", err);
      }
    }, 0);
  };

  return (
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
      <Button onClick={setRandomMatrix}>Generate Random Matrix</Button>
    </div>
  );
};

export default RandomMatrixGenerator;
