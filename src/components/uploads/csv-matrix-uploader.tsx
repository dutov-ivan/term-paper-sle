import React, { useRef } from "react";
import CsvParserWorker from "@/workers/csvParser.worker?worker";
import type { UploaderProps } from ".";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useImportModals } from "@/store/importModals";

const CsvMatrixUploader = ({ setMatrix, setSize }: UploaderProps) => {
  const workerRef = useRef<Worker>(null);
  const importModal = useImportModals((state) => state.setModal);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!workerRef.current) {
      workerRef.current = new CsvParserWorker();

      workerRef.current.onmessage = (event: MessageEvent) => {
        if (event.data.success) {
          setMatrix(event.data.data);
          setSize(event.data.data.length);
          toast.success("Matrix loaded successfully");
          importModal(null);
        } else {
          console.error("Worker error:", event.data.error);
          toast.error("Error loading matrix: " + event.data.error);
        }
      };
    }

    workerRef.current.postMessage(file);
  };

  return <Input type="file" accept=".csv" onChange={handleFileChange} />;
};

export default CsvMatrixUploader;
