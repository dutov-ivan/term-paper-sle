import { Label } from "@/components/ui/label";
import { useMatrixStore } from "@/store/matrix";
import SizeInput from "./size-input";

const SizePreferences = () => {
  const matrix = useMatrixStore((state) => state.matrix);
  const setSize = useMatrixStore((state) => state.resize);

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="size">Size</Label>
      <SizeInput size={matrix?.length ?? 0} setSize={setSize} />
    </div>
  );
};

export default SizePreferences;
