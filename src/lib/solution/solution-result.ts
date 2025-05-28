import type { SolutionResultType } from "./solution-result-type";

// SolutionResult record in TypeScript
export interface SolutionResult {
  result: SolutionResultType;
  roots?: number[];
  description?: string;
}
