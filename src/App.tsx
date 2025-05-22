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
  const [matrix, setMatrix] = useState<number[][]>([]);
  console.log("App.tsx: matrix", matrix);
  const [size, setSize] = useState(0);
  const [method, setMethod] = useState<MethodType>(MethodType.Gauss);

  const handleGenerateRandomMatrix = () => {
    if (!size || size < 1) return;
    const newMatrix = Array.from({ length: size }, () =>
      Array.from(
        { length: size + 1 },
        () => Math.floor(Math.random() * 21) - 10
      )
    );
    setMatrix(newMatrix);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={66}>
        <div className="flex flex-col gap-8 h-screen p-4">
          <div className="inline-flex">
            <AppMenubar />
          </div>

          <SolutionPreferences
            size={size}
            setSize={setSize}
            method={method}
            setMethod={setMethod}
            onGenerateRandomMatrix={handleGenerateRandomMatrix}
          />
          {matrix.length > 0 && (
            <SolutionDisplay matrix={matrix} setMatrix={setMatrix} />
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={34}>
        <div className="h-full p-4">
          <ActionSidebar
            method={method}
            matrix={matrix}
            setMatrix={setMatrix}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default App;
