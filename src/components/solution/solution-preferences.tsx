import React from 'react';
import type {SolutionPreferencesType} from "@/lib/solution/SolutionPreferences.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useSafeNumericInput} from "@/hooks/useSafeNumericInput.ts";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {MethodType} from "@/lib/methods/IMethod.ts";

interface SolutionPreferencesProps {
    preferences: SolutionPreferencesType,
    setPreferences: React.Dispatch<React.SetStateAction<SolutionPreferencesType>>,
    onGenerateRandomMatrix?: () => void // new prop
}

type MethodsDropdown = {
    [K in MethodType]: string;
}

const methodsDropdown: MethodsDropdown = {
    Gauss: "Gauss",
    GaussJordan: "Gauss-Jordan",
    InverseMatrix: "Inverse Matrix"
}

function SolutionPreferences({preferences, setPreferences, onGenerateRandomMatrix}: SolutionPreferencesProps) {
    const changeSize = useSafeNumericInput((size) => setPreferences(
        prev => ({
            ...prev, size
        })
    ))

    return (
        <div className="flex gap-8">
            <div className="flex flex-col gap-4"><Label htmlFor="size">Size</Label>
                <Input value={preferences.size} type="number" onChange={changeSize}/></div>


            <div className="flex flex-col gap-4"><Select onValueChange={(value) => setPreferences(
                prev => ({...prev, method: value as MethodType})
            )}>
                <Label htmlFor="methods">Methods</Label>

                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a method"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Method</SelectLabel>
                        {Object.entries(methodsDropdown).map(([key, value]) => (
                            <SelectItem value={key} key={key}>{value}</SelectItem>
                        ))}

                    </SelectGroup>
                </SelectContent>
            </Select>
            </div>

            <button type="button" onClick={onGenerateRandomMatrix} className="px-4 py-2 bg-blue-500 text-white rounded">
                Generate Random Matrix
            </button>
        </div>
    );
}

export default SolutionPreferences;

