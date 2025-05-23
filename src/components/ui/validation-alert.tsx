import React, { useEffect, useRef, useLayoutEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ValidationAlertProps {
  message: string;
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

// Utility to get the best position for the alert
function getPosition(anchor: HTMLElement, alert: HTMLElement) {
  const anchorRect = anchor.getBoundingClientRect();
  const alertRect = alert.getBoundingClientRect();
  const spacing = 8;
  // Try above (prefer above for more visibility)
  if (anchorRect.top > alertRect.height + spacing) {
    return {
      top: anchorRect.top - alertRect.height - spacing + window.scrollY,
      left: anchorRect.left + window.scrollX,
    };
  }
  // Try below
  if (window.innerHeight - anchorRect.bottom > alertRect.height + spacing) {
    return {
      top: anchorRect.bottom + spacing + window.scrollY,
      left: anchorRect.left + window.scrollX,
    };
  }
  // Try right
  if (window.innerWidth - anchorRect.right > alertRect.width + spacing) {
    return {
      top: anchorRect.top + window.scrollY,
      left: anchorRect.right + spacing + window.scrollX,
    };
  }
  // Try left
  if (anchorRect.left > alertRect.width + spacing) {
    return {
      top: anchorRect.top + window.scrollY,
      left: anchorRect.left - alertRect.width - spacing + window.scrollX,
    };
  }
  // Default: above
  return {
    top: anchorRect.top - alertRect.height - spacing + window.scrollY,
    left: anchorRect.left + window.scrollX,
  };
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({
  message,
  open,
  onClose,
  anchorRef,
}) => {
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (
        alertRef.current &&
        !alertRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  useLayoutEffect(() => {
    if (open && anchorRef.current && alertRef.current) {
      const pos = getPosition(anchorRef.current, alertRef.current);
      alertRef.current.style.position = "absolute";
      alertRef.current.style.top = `${pos.top}px`;
      alertRef.current.style.left = `${pos.left}px`;
      alertRef.current.style.zIndex = "9999";
    }
  }, [open, anchorRef, message]);

  if (!open) return null;

  return (
    <div ref={alertRef}>
      <Alert variant="destructive" className="relative min-w-[260px]">
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 8, right: 8 }}
          aria-label="Close"
        >
          ×
        </button>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};
