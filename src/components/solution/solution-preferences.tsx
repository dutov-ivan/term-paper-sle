import React from "react";
import type { SolutionPreferencesType } from "@/lib/solution/SolutionPreferences.ts";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useSafeNumericInput } from "@/hooks/useSafeNumericInput.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MethodType } from "@/lib/methods/IMethod.ts";
import { Button } from "../ui/button";

interface SolutionPreferencesProps {
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  method: MethodType;
  setMethod: React.Dispatch<React.SetStateAction<MethodType>>;
  onGenerateRandomMatrix?: () => void; // new prop
}

type MethodsDropdown = {
  [K in MethodType]: string;
};

const methodsDropdown: MethodsDropdown = {
  Gauss: "Gauss",
  GaussJordan: "Gauss-Jordan",
  InverseMatrix: "Inverse Matrix",
};

function SolutionPreferences({
  size,
  setSize,
  method,
  setMethod,
  onGenerateRandomMatrix,
}: SolutionPreferencesProps) {
  const { value: sizeValue, onChange: changeSizeValue } = useSafeNumericInput(
    size,
    setSize
  );

  return (
    <div className="flex gap-4 items-end">
      <div className="flex flex-col gap-4">
        <Label htmlFor="size">Size</Label>
        <Input
          value={size}
          type="number"
          onChange={(e) => changeSizeValue(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Select
          value={method}
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

      <Button onClick={onGenerateRandomMatrix}>Generate Random Matrix</Button>
    </div>
  );
}

export default SolutionPreferences;
