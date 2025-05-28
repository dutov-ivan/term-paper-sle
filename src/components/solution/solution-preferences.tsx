import SizePreferences from "./preferences/size-preferences";
import MethodPreferences from "./preferences/method-preferences";
import RandomMatrixGenerator from "./preferences/random-matrix-generator";
import CopyMatrix from "./preferences/copy-matrix";
import SetMatrixFromInput from "./preferences/set-matrix-from-input";
import { useState } from "react";
import ClearMatrixPreferences from "./preferences/clear-matrix-preferences";

function SolutionPreferences() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="flex gap-4 items-end flex-wrap"
      style={{ position: "relative" }}
    >
      <SizePreferences />
      <ClearMatrixPreferences />
      <RandomMatrixGenerator />
      <SetMatrixFromInput open={open} setOpen={setOpen} />
      <MethodPreferences />
      <CopyMatrix />
    </div>
  );
}

export default SolutionPreferences;
