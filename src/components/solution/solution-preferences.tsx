import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMethodTypeFromClass,
  MethodType,
  type IMethod,
} from "@/lib/methods/IMethod.ts";
import { Button } from "../ui/button";
import { useMatrixStore } from "@/store/matrix";
import { useSolutionStore } from "@/store/solution";
import { GaussMethod } from "@/lib/methods/GaussMethod";
import { useEffect, useState, useRef } from "react";
import { ValidationAlert } from "@/components/ui/validation-alert";
import { z } from "zod";

type MethodsDropdown = {
  [K in MethodType]: string;
};

const methodsDropdown: MethodsDropdown = {
  Gauss: "Gauss",
  GaussJordan: "Gauss-Jordan",
  InverseMatrix: "Inverse Matrix",
};

// Zod schema for size validation
const sizeSchema = z
  .number({ invalid_type_error: "Size must be a number" })
  .int("Size must be an integer")
  .min(1, "Size must be at least 1")
  .max(1000, "Size must be at most 1000");

function SolutionPreferences() {
  const size = useMatrixStore((state) => state.size);
  const setSize = useMatrixStore((state) => state.setSize);
  const setRandomMatrix = useMatrixStore((state) => state.setRandomMatrix);

  const solutionMethod = useSolutionStore((state) => state.method);
  const setMethodStore = useSolutionStore((state) => state.setMethod);

  const [method, setMethod] = useState<MethodType | null>(
    solutionMethod && getMethodTypeFromClass(solutionMethod)
  );

  // Local state for size input
  const [sizeInput, setSizeInput] = useState(size.toString());
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSizeInput(size.toString());
  }, [size]);

  useEffect(() => {
    if (!method) return;
    setMethodStore(method);
  }, [method]);

  return (
    <div className="flex gap-4 items-end" style={{ position: "relative" }}>
      <div className="flex flex-col gap-4">
        <Label htmlFor="size">Size</Label>
        <Input
          ref={inputRef}
          value={sizeInput}
          type="number"
          onChange={(e) => setSizeInput(e.target.value)}
        />
        <ValidationAlert
          message={error || ""}
          open={!!error}
          onClose={() => setError(null)}
          anchorRef={inputRef as React.RefObject<HTMLElement>}
        />
      </div>
      <Button
        onClick={() => {
          const parsed = Number(sizeInput);
          const result = sizeSchema.safeParse(parsed);
          if (!result.success) {
            setError(result.error.errors[0].message);
            return;
          }
          setError(null);
          setSize(parsed);
        }}
      >
        Resize Matrix
      </Button>
      <div className="flex flex-col gap-4">
        <Select
          value={method ?? undefined}
          onValueChange={(value) => setMethod(value as MethodType)}
        >
          <Label htmlFor="methods">Methods</Label>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a method" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Method</SelectLabel>
              {Object.entries(methodsDropdown).map(([key, value]) => (
                <SelectItem value={key} key={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => setRandomMatrix()}>Generate Random Matrix</Button>
    </div>
  );
}

export default SolutionPreferences;
