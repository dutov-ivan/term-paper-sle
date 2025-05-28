import * as React from "react";
import { cn } from "@/lib/utils";

function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-container"
      className={cn("relative w-full overflow-x-auto", className)}
    >
      <div
        data-slot="grid"
        className={cn("grid w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function GridHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-header"
      className={cn("border-b", className)}
      {...props}
    />
  );
}

function GridBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-body"
      className={cn("divide-y", className)}
      {...props}
    />
  );
}

function GridFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-footer"
      className={cn(
        "bg-muted/50 border-t font-medium last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function GridRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-row"
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors border-b",
        className
      )}
      {...props}
    />
  );
}

function GridHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-head"
      className={cn(
        "text-foreground h-10 px-2 text-left font-medium whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function GridCell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-cell"
      className={cn("p-2 whitespace-nowrap", className)}
      {...props}
    />
  );
}

function GridCaption({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Grid,
  GridHeader,
  GridBody,
  GridFooter,
  GridRow,
  GridHead,
  GridCell,
  GridCaption,
};
