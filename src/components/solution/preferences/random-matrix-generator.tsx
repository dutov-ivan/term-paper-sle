import { Button } from "@/components/ui/button";
import { useMatrixStore } from "@/store/matrix";
import { toast } from "sonner";

function generateRandomMatrix(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size + 1 }, () => Math.floor(Math.random() * 100))
  );
}

const RandomMatrixGenerator = () => {
  const size = useMatrixStore((state) => state.size);
  const setMatrix = useMatrixStore((state) => state.setMatrix);
  const setIsLoadingMatrix = useMatrixStore(
    (state) => state.setIsLoadingMatrix
  );

  const setRandomMatrix = () => {
    if (size <= 0) {
      toast.error("Please set the matrix size first.");
      return;
    }
    setIsLoadingMatrix(true);
    setTimeout(() => {
      const randomMatrix = generateRandomMatrix(size);
      setMatrix(randomMatrix);
      setIsLoadingMatrix(false);
    }, 0);
  };

  return (
    <>
      <Button onClick={() => setRandomMatrix()}>Generate Random Matrix</Button>
    </>
  );
};

export default RandomMatrixGenerator;
