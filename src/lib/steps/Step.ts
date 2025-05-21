import { Matrix } from "../Matrix";
import { StepAction } from "../StepAction";

// Step record in TypeScript
export interface Step {
  sourceRow: number;
  targetRow: number;
  action: StepAction;
  coefs: Matrix;
}
