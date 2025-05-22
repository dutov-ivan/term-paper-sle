import AppMenubar from "./components/app-menubar";
import { type IMethod, MethodType } from "@/lib/methods/IMethod.ts";
import { useState } from "react";
import SolutionDisplay from "@/components/solution/solution-display.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import type { SolutionPreferencesType } from "@/lib/solution/SolutionPreferences.ts";
import SolutionPreferences from "@/components/solution/solution-preferences.tsx";

const App = () => {
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [solutionPreferences, setSolutionPreferences] =
    useState<SolutionPreferencesType>({
      size: 0,
      method: MethodType.Gauss,
    });

  console.log(matrix);

  // Generate a random matrix of the given size (size x size+1 for augmented matrix)
  const handleGenerateRandomMatrix = () => {
    const size = solutionPreferences.size;
    if (!size || size < 1) return;
    const newMatrix = Array.from({ length: size }, () =>
      Array.from(
        { length: size + 1 },
        () => Math.floor(Math.random() * 21) - 10
      )
    );
    setMatrix(newMatrix);
  };

  return (
    <ThemeProvider>
      <div className="h-screen">
        <div className="w-2/3 flex flex-col gap-0 h-full">
          <AppMenubar />
          {matrix.length > 0 && (
            <SolutionDisplay matrix={matrix} setMatrix={setMatrix} />
          )}
          <SolutionPreferences
            preferences={solutionPreferences}
            setPreferences={setSolutionPreferences}
            onGenerateRandomMatrix={handleGenerateRandomMatrix}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
