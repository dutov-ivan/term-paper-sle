import type { MatrixLoadingDialogType } from "@/lib/uploader";
import CsvMatrixUploader from "./csv-matrix-uploader";
import { useMatrixStore } from "@/store/matrix";

const MatrixUploader = ({ type }: { type: MatrixLoadingDialogType }) => {
  const setMatrix = useMatrixStore((state) => state.setMatrixConfiguration);
  const setSize = useMatrixStore((state) => state.resize);
  switch (type) {
    case "CSV":
      return <CsvMatrixUploader setSize={setSize} setMatrix={setMatrix} />;
    default:
      return <div>Unsupported file type</div>;
  }
};

export default MatrixUploader;
