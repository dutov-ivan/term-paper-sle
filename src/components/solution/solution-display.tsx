import React from 'react';
import {Table, TableBody, TableRow} from "@/components/ui/table.tsx";
import SolutionCell from "@/components/solution/solution-cell.tsx";

function SolutionDisplay({elements, setElements}: {
    elements: number[][],
    setElements: React.Dispatch<React.SetStateAction<number[][]>>
}) {

    const setContents = (columnIndex: number, rowIndex: number) => {
        return function setContents(contents: number) {
            setElements(prev =>
                prev.map((row, i) =>
                    row.map((val, j) =>
                        i === rowIndex && j === columnIndex ? contents : val
                    )
                )
            );
        }
    }

    return (
        <Table>
            <TableBody>
                {elements.map((row, i) => (
                    <TableRow key={i}>
                        {row.map((cell, j) => (
                            <SolutionCell key={`${i}-${j}`} contents={cell} rowIndex={i} rowLength={row.length}
                                          setContents={setContents(j, i)}  />
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default SolutionDisplay;