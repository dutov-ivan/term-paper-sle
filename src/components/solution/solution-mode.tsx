import AppMenubar from "@/components/app-menubar";
import SolutionDisplay from "@/components/solution/solution-display.tsx";
import SolutionPreferences from "@/components/solution/solution-preferences";
import ActionSidebar from "@/components/action/action-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { createSolutionWorker } from "@/workers/solution.worker-wrapper";
import { toast } from "sonner";
import { useSolutionWorkerStore } from "@/store/solutionWorker";

const SolutionMode = () => {
  const [isMobile, setIsMobile] = useState(false);
  const setWorker = useSolutionWorkerStore((state) => state.setWorker);
  useEffect(() => {
    const worker = createSolutionWorker();
    if (!worker) {
      toast.error("Failed to create solution worker.");
      return;
    }
    setWorker(worker);
  }, [setWorker]);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-8 h-screen p-4">
        <div className="inline-flex">
          <AppMenubar />
        </div>
        <SolutionPreferences />
        <SolutionDisplay />
        <ActionSidebar showStepListInDrawer />
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={66} minSize={40}>
        <div className="flex flex-col gap-8 h-screen p-4">
          <div className="inline-flex">
            <AppMenubar />
          </div>

          <SolutionPreferences />
          <SolutionDisplay />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={34} minSize={16}>
        <div className="h-full p-4">
          <ActionSidebar />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SolutionMode;
