import SizePreferences from "./preferences/size-preferences";
import MethodPreferences from "./preferences/method-preferences";
import RandomMatrixGenerator from "./preferences/random-matrix-generator";
import CopyMatrix from "./preferences/copy-matrix";

function SolutionPreferences() {
  return (
    <div className="flex gap-4 items-end" style={{ position: "relative" }}>
      <SizePreferences />
      <RandomMatrixGenerator />
      <MethodPreferences />
      <CopyMatrix />
    </div>
  );
}

export default SolutionPreferences;
