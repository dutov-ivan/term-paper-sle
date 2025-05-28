export const SolutionResultEnum = {
  Unique: "Unique",
  Infinite: "Infinite",
  None: "None",
  NoneOrInfinite: "NoneOrInfinite",
} as const;

export type SolutionResultType =
  (typeof SolutionResultEnum)[keyof typeof SolutionResultEnum];
