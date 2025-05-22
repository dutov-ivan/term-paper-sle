import type { ChangeEvent } from "react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export const useSafeNumericInput = (
  input: number, // <-- new: take the current external value
  setInput: (num: number) => void
) => {
  const toastDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [value, setValue] = useState(input.toString());

  // Sync internal value when external input changes
  useEffect(() => {
    const inputAsString = input.toString();
    if (inputAsString !== value) {
      setValue(inputAsString);
    }
  }, [input]); // react to external `input` changes

  function onChange(newValue: string) {
    setValue(newValue);

    if (newValue === "" || newValue === "-") return;

    const parsed = Number(newValue);
    if (isNaN(parsed)) {
      if (toastDebounceRef.current) clearTimeout(toastDebounceRef.current);
      toastDebounceRef.current = setTimeout(() => {
        toast.error("The provided value must be a number");
      }, 300);
      return;
    }

    setInput(parsed);
  }

  return { value, onChange };
};
