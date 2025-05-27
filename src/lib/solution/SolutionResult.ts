import { SolutionResultType } from "./SolutionResultType";

// SolutionResult record in TypeScript
export interface SolutionResult {
  result: SolutionResultType;
  roots?: number[];
  description?: string;
}
