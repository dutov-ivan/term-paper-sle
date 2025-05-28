import { Button } from "@/components/ui/button";
import { useMatrixStore } from "@/store/matrix";
import { Eraser } from "lucide-react";
import { toast } from "sonner";

const ClearMatrixPreferences = () => {
  const setSlae = useMatrixStore((state) => state.setSlae);
  const slae = useMatrixStore((state) => state.slae);

  const clearSlae = () => {
    if (!slae) {
      toast.error("SLAE is not set.");
      return;
    }
    const rows = slae?.length;
    const cols = slae[0]?.length;
    setSlae(new Array(rows).fill(0).map(() => new Array(cols).fill(0)));
  };
  return (
    <Button disabled={!slae} onClick={clearSlae}>
      <Eraser />
    </Button>
  );
};

export default ClearMatrixPreferences;
