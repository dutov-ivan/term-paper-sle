import { Label } from "@/components/ui/label";
import { useMatrixStore } from "@/store/matrix";
import SizeInput from "./size-input";

const SizePreferences = () => {
  const size = useMatrixStore((state) => state.size);
  const setSize = useMatrixStore((state) => state.resize);

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="size">Size</Label>
      <SizeInput size={size} setSize={setSize} />
    </div>
  );
};

export default SizePreferences;
