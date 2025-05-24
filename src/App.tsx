import GraphingMode from "./components/graphs/charting-mode";
import SolutionMode from "./components/solution/solution-mode";
import { useModeStore } from "./store/mode";

const App = () => {
  const mode = useModeStore((state) => state.mode);
  return mode === "solution" ? <SolutionMode /> : <GraphingMode />;
};

export default App;
