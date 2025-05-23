import AppMenubar from "./components/app-menubar";
import { type IMethod, MethodType } from "@/lib/methods/IMethod.ts";
import { useState } from "react";
import SolutionDisplay from "@/components/solution/solution-display.tsx";
import SolutionPreferences from "@/components/solution/solution-preferences";
import ActionSidebar from "./components/action/action-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";

const App = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={66}>
        <div className="flex flex-col gap-8 h-screen p-4">
          <div className="inline-flex">
            <AppMenubar />
          </div>

          <SolutionPreferences />
          <SolutionDisplay />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={34}>
        <div className="h-full p-4">
          <ActionSidebar />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default App;
