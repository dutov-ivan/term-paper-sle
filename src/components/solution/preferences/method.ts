import type { MethodType } from "@/lib/methods/IMethod";

type MethodsDropdown = {
  [K in MethodType]: string;
};

export const methodToString: MethodsDropdown = {
  Gauss: "Gauss",
  GaussJordan: "Gauss-Jordan",
  InverseMatrix: "Inverse Matrix",
};
