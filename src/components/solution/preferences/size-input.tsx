import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSafeNumericInput } from "@/hooks/use-safe-numeric-input";

const SizeInput = ({
  size,
  setSize,
}: {
  size: number;
  setSize: (size: number) => void;
}) => {
  const { safeInput, onSafeInputChange, isValid, parsedValue } =
    useSafeNumericInput(size, () => {}, {
      bounds: { min: 1, max: 1000 },
      mustBeInteger: true,
    });

  return (
    <div className="flex gap-2">
      <Input
        value={safeInput}
        type="text"
        onChange={(e) => onSafeInputChange(e.target.value)}
      />
      <Button
        variant="outline"
        onClick={() => setSize(parsedValue)}
        disabled={!isValid}
      >
        Set
      </Button>
    </div>
  );
};

export default SizeInput;
