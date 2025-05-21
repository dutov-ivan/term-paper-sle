import {type ChangeEvent} from 'react';
import {TableCell} from "@/components/ui/table.tsx";
import {Input} from "@/components/ui/input.tsx";
import {toast} from "sonner";

interface SolutionCellProps {
    contents: number, rowIndex: number, rowLength: number;
    setContents: (cell: number) => void;
}


function SolutionCell({ contents, rowIndex, rowLength, setContents}: SolutionCellProps) {
    const isEnding = rowIndex === rowLength - 1;
    const isStarting = rowIndex === 0;
    const coefficient = `x${rowIndex}`;

    const changeContents = (e: ChangeEvent<HTMLInputElement>) => {
        const parsed = Number(e.target.value);
        if (isNaN(parsed)) {
            toast.error("The provided value must be a number")
            return;
        }
        setContents(parsed)
    }

    return (
        <TableCell>
            {!isStarting && (
                <span>{isEnding ? "=" : "+"}</span>
            )}
            <Input value={contents} onChange={changeContents} />
            {coefficient}
        </TableCell>
    );
}

export default SolutionCell;