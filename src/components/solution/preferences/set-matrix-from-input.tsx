import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMatrixStore } from "@/store/matrix";
import { TextCursorInput } from "lucide-react";
import { toast } from "sonner"; // or any toast/error UI you prefer
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const parseMatrix = (separator: string, text: string): number[][] => {
  const lines = text.trim().split("\n");
  const rowCount = lines.length;
  const expectedColCount = rowCount + 1;

  const parsedMatrix = lines.map((line, rowIndex) => {
    const values = line
      .trim()
      .split(separator)
      .map((str) => {
        const num = Number(str);
        if (isNaN(num)) {
          throw new Error(`Invalid number "${str}" on line ${rowIndex + 1}`);
        }
        return num;
      });

    if (values.length !== expectedColCount) {
      throw new Error(
        `Line ${rowIndex + 1} must have ${expectedColCount} values (found ${
          values.length
        })`
      );
    }

    return values;
  });
  return parsedMatrix;
};

const convertMatrixToText = (matrix: number[][], separator: string): string => {
  return matrix
    .map((row) => row.map((num) => num.toString()).join(separator))
    .join("\n");
};

const SetMatrixFromInput = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const matrix = useMatrixStore((state) => state.slae);
  const setMatrix = useMatrixStore((state) => state.setMatrix);
  const [separator, setSeparator] = useState<string>(",");
  const [textareaDraft, setTextareaDraft] = useState(matrix?.join("\n") || "");

  useEffect(() => {
    if (
      separator === "" ||
      separator === "\n" ||
      separator === "." ||
      separator === "-"
    ) {
      toast.error("Invalid separator. Please use a valid character.");
      setSeparator(",");
    }
    if (matrix) {
      setTextareaDraft(convertMatrixToText(matrix, separator));
    }
  }, [matrix, separator]);

  const onSubmit = () => {
    try {
      const parsedMatrix = parseMatrix(separator, textareaDraft);
      setMatrix({
        type: "standard",
        matrix: parsedMatrix,
      });
      setOpen(false);
    } catch (error: unknown) {
      toast.error("Matrix parsing failed", {
        description: (error as Error).message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          Matrix from text <TextCursorInput />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Input your matrix in text format</DialogTitle>
          <DialogDescription>
            One row per line. Rows should be separated by any chars specified
            below
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center mb-4">
          <Label className="mr-2">Separator:</Label>
          <Input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </div>
        <Textarea
          wrap="off"
          className="w-full h-full overflow-auto "
          value={textareaDraft}
          onChange={(e) => {
            setTextareaDraft(e.target.value);
          }}
        />
        <div className="mt-4 flex justify-end">
          <Button type="submit" onClick={onSubmit} variant="outline">
            Set Matrix
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetMatrixFromInput;
