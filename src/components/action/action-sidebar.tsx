import React, {useState} from 'react';
import type {Step} from "@/lib/steps/Step.ts";

interface ActionMenuProps {
    setMatrix: React.Dispatch<React.SetStateAction<number[][]>>,
    matrix: number[][]
}

function ActionSidebar({}) {
    const [history, setHistory] = useState<Step[]>([])
    return (
        <div>
            <h1>Action list</h1>
        </div>
    );
}

export default ActionSidebar;