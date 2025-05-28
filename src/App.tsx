import { useEffect } from "react";
import ChartingMode from "./components/charts/charting-mode";
import SolutionMode from "./components/solution/solution-mode";
import { useModeStore } from "./store/mode";
import { useSolutionStore } from "./store/solution";
import { toast } from "sonner";
import { useMatrixStore } from "./store/matrix";

const App = () => {
  const mode = useModeStore((state) => state.mode);
  const setSlae = useMatrixStore((state) => state.setSlae);
  const solutionWorker = useSolutionStore((state) => state.worker);
  useEffect(() => {
    if (!solutionWorker) {
      toast.error("Solution worker is not initialized.");
      return;
    }
    solutionWorker.reset();
    setSlae([]);
  }, [mode]);
  return mode === "solution" ? <SolutionMode /> : <ChartingMode />;
};

export default App;
