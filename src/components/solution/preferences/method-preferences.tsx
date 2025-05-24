import React from "react";
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
import { getMethodTypeFromClass, MethodType } from "@/lib/methods/IMethod.ts";
import { useSolutionStore } from "@/store/solution";
import { useEffect, useState } from "react";
import { methodToString } from "./method";

const MethodPreferences = () => {
  const solutionMethod = useSolutionStore((state) => state.method);
  const setMethodStore = useSolutionStore((state) => state.setMethod);

  const [method, setMethod] = useState<MethodType | null>(
    solutionMethod && getMethodTypeFromClass(solutionMethod)
  );

  // Local state for size input

  useEffect(() => {
    if (!method) return;
    setMethodStore(method);
  }, [method]);

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
