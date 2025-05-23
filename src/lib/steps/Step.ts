import { StepAction } from "@/lib/steps/StepAction.ts";

// Step record in TypeScript
export interface Step {
  sourceRow: number;
  targetRow: number;
  action: StepAction;
  coefficients: number[][];
}
