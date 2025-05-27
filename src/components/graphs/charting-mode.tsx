import AppMenubar from "../app-menubar";
import ChartGenerator from "./chart-generator";

const ChartingMode = () => {
  return (
    <div className="flex flex-col gap-4 h-screen p-4">
      <div className="inline-flex">
        <AppMenubar />
      </div>
      <ChartGenerator />
    </div>
  );
};

export default ChartingMode;
