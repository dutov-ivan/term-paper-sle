import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label.tsx";
import { MethodType } from "@/lib/methods/IMethod.ts";
import { useSolutionStore } from "@/store/solution";
import { methodToString } from "./method";

const MethodPreferences = () => {
  const method = useSolutionStore((state) => state.method);
  const setStoreMethod = useSolutionStore((state) => state.setMethod);
  const worker = useSolutionStore((state) => state.worker);

  const setMethod = (value: MethodType) => {
    setStoreMethod(value);
    if (worker) {
      worker.setMethod(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="methods">Methods</Label>

      <Select
        value={method ?? undefined}
        onValueChange={(value) => setMethod(value as MethodType)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a method" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Method</SelectLabel>
            {Object.entries(methodToString).map(([key, value]) => (
              <SelectItem value={key} key={key}>
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MethodPreferences;
