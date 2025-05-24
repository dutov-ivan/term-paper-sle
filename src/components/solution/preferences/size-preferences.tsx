import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationAlert } from "@/components/ui/validation-alert";
import { useMatrixStore } from "@/store/matrix";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";

const sizeSchema = z
  .number({ invalid_type_error: "Size must be a number" })
  .int("Size must be an integer")
  .min(1, "Size must be at least 1")
  .max(10000, "Size must be at most 10000");

const SizePreferences = () => {
  const size = useMatrixStore((state) => state.size);
  const setSize = useMatrixStore((state) => state.setSize);
  const [sizeInput, setSizeInput] = useState(size.toString());
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setSizeInput(size.toString());
  }, [size]);

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="size">Size</Label>
      <div className="flex gap-2">
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
        <Button
          variant="outline"
          onClick={() => {
            try {
              const parsedSize = sizeSchema.parse(Number(sizeInput));
              setSize(parsedSize);
              setError(null);
            } catch (e) {
              if (e instanceof z.ZodError) {
                setError(e.errors[0].message);
              }
            }
          }}
        >
          Set
        </Button>
      </div>
    </div>
  );
};

export default SizePreferences;
