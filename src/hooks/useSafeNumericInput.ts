import type { ChangeEvent } from "react";
import { toast } from "sonner";

export const useSafeNumericInput = (setInput: (num: number) => void) => {
  return function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "" || value === "-") {
      // Allow incomplete input, do not call setInput
      return;
    }
    const parsed = Number(value);
    if (isNaN(parsed)) {
      toast.error("The provided value must be a number");
      return;
    }
    setInput(parsed);
  };
};
