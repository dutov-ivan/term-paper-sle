import type { MethodType } from "@/lib/methods/IMethod";

type MethodValues = {
  [K in MethodType]?: number;
};

export type ChartDataEntry = {
  size: number;
} & MethodValues;

type ChartGivenConfig = {
  label: string;
  color: string;
};

export type ChartGroup = {
  [K in MethodType]?: ChartGivenConfig;
};
