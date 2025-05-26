import SizePreferences from "./preferences/size-preferences";
import MethodPreferences from "./preferences/method-preferences";
import RandomMatrixGenerator from "./preferences/random-matrix-generator";
import CopyMatrix from "./preferences/copy-matrix";
import SetMatrixFromInput from "./preferences/set-matrix-from-input";
import { useState } from "react";

function SolutionPreferences() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-4 items-end" style={{ position: "relative" }}>
      <SizePreferences />
      <RandomMatrixGenerator />
      <MethodPreferences />
      <CopyMatrix />
      <SetMatrixFromInput open={open} setOpen={setOpen} />
    </div>
  );
}

export default SolutionPreferences;
