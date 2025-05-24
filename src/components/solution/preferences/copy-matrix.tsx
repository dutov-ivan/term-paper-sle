import { Button } from "@/components/ui/button";
import { useMatrixStore } from "@/store/matrix";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import React from "react";

const CopyMatrix = () => {
  const matrix = useMatrixStore((state) => state.matrix);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      let content = "";
      for (let i = 0; i < matrix.length; i++) {
        content += matrix[i].join(",") + "\n";
      }
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  return (
    <Button onClick={copyToClipboard} variant="outline">
      {copied ? <CopyCheckIcon /> : <CopyIcon />}
    </Button>
  );
};

export default CopyMatrix;
