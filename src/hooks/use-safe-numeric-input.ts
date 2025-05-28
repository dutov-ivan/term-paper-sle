import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { displayNumber, MAX_AFTER_DOT, MAX_BEFORE_DOT } from "@/lib/math/utils";

type Bounds = { min?: number; max?: number };

interface SafeNumericInputOptions {
  bounds?: Bounds;
  mustBeInteger?: boolean;
  checkValidPrecision?: boolean;
}

export function validateNumericValue(
  value: string,
  options: SafeNumericInputOptions = {}
): string | null {
  const { bounds, mustBeInteger = false, checkValidPrecision = true } = options;

  if (value === "" || value === "-") return null;
  const parsed = Number(value);
  if (isNaN(parsed)) return "Invalid number";

  if (bounds) {
    const { min, max } = bounds;
    if (min !== undefined && parsed < min)
      return `Value is below minimum ${min}`;
    if (max !== undefined && parsed > max)
      return `Value is above maximum ${max}`;
  }

  if (mustBeInteger && !Number.isInteger(parsed)) {
    return "Value must be an integer";
  }

  if (checkValidPrecision) {
    const [beforeDot, afterDot] = value.split(".");
    if (
      (beforeDot && beforeDot.length > MAX_BEFORE_DOT) ||
      (afterDot && afterDot.length > MAX_AFTER_DOT)
    ) {
      return `Max ${MAX_BEFORE_DOT} digits before and ${MAX_AFTER_DOT} after the dot.`;
    }
  }

  return null;
}

export const useSafeNumericInput = (
  input: number,
  setInput: (num: number) => void,
  {
    bounds,
    mustBeInteger = false,
    checkValidPrecision = true,
  }: SafeNumericInputOptions = {}
) => {
  const [safeInput, setValue] = useState(() => input.toFixed(MAX_AFTER_DOT));
  const [isValid, setIsValid] = useState(true);
  const [parsedValue, setParsedValue] = useState<number>(input);
  const inputRef = useRef<HTMLElement | null>(null);

  const lastToastTimeRef = useRef<number>(0);
  const TOAST_THROTTLE_MS = 2000; // 2 seconds

  useEffect(() => {
    const inputAsString = displayNumber(input);
    if (
      document.activeElement !== inputRef.current &&
      inputAsString !== safeInput
    ) {
      setValue(inputAsString);
      setParsedValue(Number(inputAsString));
      setIsValid(true);
    }
  }, [input]);

  function maybeShowToast(message: string) {
    const now = Date.now();
    if (now - lastToastTimeRef.current > TOAST_THROTTLE_MS) {
      toast.error(message);
      lastToastTimeRef.current = now;
    }
  }

  function onSafeInputChange(newValue: string) {
    setValue(newValue);

    const validationResult = validateNumericValue(newValue, {
      bounds,
      mustBeInteger,
      checkValidPrecision,
    });

    if (validationResult === null) {
      if (newValue.trim() !== "" && newValue.trim() !== "-") {
        const parsed = Number(newValue);
        setIsValid(true);
        setParsedValue(parsed);
        setInput(parsed);
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
      maybeShowToast(validationResult);
    }
  }

  function onBlur() {
    const validationResult = validateNumericValue(safeInput, {
      bounds,
      mustBeInteger,
      checkValidPrecision,
    });
    if (validationResult) {
      maybeShowToast(validationResult);
      setIsValid(false);
    }
  }

  return {
    safeInput,
    onSafeInputChange,
    isValid,
    parsedValue,
    onBlur,
    setSafeInput: setValue,
    inputRef,
  };
};
