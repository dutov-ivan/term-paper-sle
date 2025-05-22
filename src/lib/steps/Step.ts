import { Matrix } from "../Matrix";
import {StepAction} from "@/lib/steps/StepAction.ts";

// Step record in TypeScript
export interface Step {
  sourceRow: number;
  targetRow: number;
  action: StepAction;
  coefficients: Matrix;
}

const makeStepDescription = (step: Step) => {

}