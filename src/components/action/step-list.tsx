import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  getStepDescription,
  type StepMetadata,
} from "@/lib/steps/step-metadata";

interface StepListProps {
  steps: StepMetadata[];
  index: number;
}

const StepList: React.FC<StepListProps> = ({ steps, index }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: index + 1,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  React.useEffect(() => {
    virtualizer.scrollToIndex(index, { align: "center", behavior: "smooth" });
  }, [index, virtualizer]);

  return (
    <div ref={containerRef} className="relative h-[500px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="p-2 border rounded-md absolute w-full"
            style={{
              transform: `translateY(${virtualItem.start}px)`,
              height: `${virtualItem.size}px`,
            }}
          >
            {getStepDescription(steps[virtualItem.index])}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepList;
