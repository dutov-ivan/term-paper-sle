import { Button } from "@/components/ui/button";
import { DecimalMatrix } from "@/lib/math/DecimalMatrix";
import { generateRandomMatrix } from "@/lib/math/Matrix";
import { useMatrixStore } from "@/store/matrix";
import Decimal from "decimal.js";
import { toast } from "sonner";

const RandomMatrixGenerator = () => {
  const size = useMatrixStore((state) => state.size);
  const setMatrix = useMatrixStore((state) => state.setDecimalMatrix);
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
      const decimalMatrix = DecimalMatrix.fromNumbers(
        randomMatrix.map((row) => row.map((value) => String(value)))
      );
      console.log("Decimal Matrix:", randomMatrix);
      setMatrix(decimalMatrix);
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
