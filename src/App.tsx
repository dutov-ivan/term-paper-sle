import AppMenubar from './components/app-menubar'
import type {IMethod} from "@/lib/methods/IMethod.ts";
import {useState} from "react";
import SolutionDisplay from "@/components/solution/solution-display.tsx";

const App = () => {
    const [elements, setElements] = useState<number[][]>([]);
    const [method, setMethod] = useState<IMethod>();
  return (
    <div>
        <div>
            <AppMenubar />
            <SolutionDisplay elements={elements} setElements={setElements} />
        </div>
    </div>
  )
}

export default App