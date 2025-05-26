type StepType = "eliminate" | "scale" | "swap";

export type StepMetadata = {
  sourceRow: number;
  targetRow: number;
  type: StepType;
  multiplier?: number;
};

export function getStepDescription(step: StepMetadata): string {
  switch (step.type) {
    case "eliminate":
      return `Eliminating row ${step.targetRow} using row ${step.sourceRow}`;
    case "scale":
      return `Scaling row ${step.sourceRow} by a factor of ${step.multiplier}`;
    case "swap":
      return `Swapping rows ${step.sourceRow} and ${step.targetRow}`;
    default:
      return "Unknown step type";
  }
}
