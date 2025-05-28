import { expose } from "comlink";
import {
  createSolutionMethodFromType,
  getMethodTypeFromClass,
  type IMethod,
  type MethodType,
} from "@/lib/methods/IMethod";
import type { Step } from "@/lib/steps/step";
import type { SolutionResult } from "@/lib/solution/solution-result";
import { SlaeMatrix } from "@/lib/math/slae-matrix";
import type { StepMetadata } from "@/lib/steps/step-metadata";
import { InverseMethod } from "@/lib/methods/inverse-method";
import type { MatrixConfiguration } from "@/store/matrix";

export class SolutionWorker {
  methodInstance: IMethod | null = null;
  methodType: MethodType | null = null;
  matrixInstance: SlaeMatrix | null = null;
  iterator: Iterator<Step> | null = null;
  appliedSteps: Step[] = [];
  currentStepIndex = -1;

  setMethod(method: MethodType): void {
    if (this.methodInstance) {
      const type = getMethodTypeFromClass(this.methodInstance);
      if (type === method) return;
    }

    if (!this.matrixInstance) {
      this.methodType = method;
      return;
    }

    this.methodInstance = createSolutionMethodFromType(
      method,
      this.matrixInstance
    );

    this.iterator = this.methodInstance.getForwardSteps();
    this.appliedSteps = [];
  }

  getNextStep(): StepMetadata | null {
    if (!this.iterator || !this.matrixInstance || !this.methodInstance)
      return null;

    console.log("WEBWORKER: Current step index:", this.currentStepIndex);
    if (this.currentStepIndex >= this.appliedSteps.length - 1) {
      const next = this.iterator.next();
      if (next.done) return null;

      this.appliedSteps.push(next.value);
      this.currentStepIndex++;
    } else {
      this.currentStepIndex++;
      const nextMatrix = SlaeMatrix.fromMatrix(this.matrixInstance);
      this.appliedSteps[this.currentStepIndex].perform(nextMatrix);
      this.matrixInstance = nextMatrix;
    }

    return this.appliedSteps[this.currentStepIndex].toMetadata();
  }

  getPreviousStep(): StepMetadata | null {
    if (!this.matrixInstance || this.appliedSteps.length === 0) return null;
    if (this.currentStepIndex === -1) return null;

    const lastStep = this.appliedSteps[this.currentStepIndex];

    if (this.methodInstance instanceof InverseMethod) {
      this.methodInstance.adjustedMatrix!.contents = lastStep.inverse(
        this.methodInstance.adjustedMatrix!.contents
      );
      this.methodInstance.inverseMatrix!.contents = lastStep.inverse(
        this.methodInstance.inverseMatrix!.contents
      );
    } else {
      this.matrixInstance.contents = lastStep.inverse(
        this.matrixInstance.contents
      );
    }

    const metadata = lastStep.toMetadata();
    this.currentStepIndex--;

    return metadata;
  }

  getCurrentMatrix(): MatrixConfiguration | null {
    if (this.methodInstance instanceof InverseMethod) {
      return {
        type: "inverse",
        adjusted: this.methodInstance.adjustedMatrix!.contents,
        inverse: this.methodInstance.inverseMatrix!.contents,
      };
    }
    return {
      type: "standard",
      matrix: this.matrixInstance?.contents ?? [],
    };
  }

  getSteps(): StepMetadata[] {
    return this.appliedSteps.map((step) => step.toMetadata());
  }

  skipAndFinishForward(): {
    results: SolutionResult | null;
    steps: StepMetadata[];
    matrix: MatrixConfiguration;
  } | null {
    console.log(this.iterator, this.methodInstance, this.matrixInstance);
    if (!this.iterator || !this.methodInstance || !this.matrixInstance)
      return null;

    while (this.getNextStep());

    this.currentStepIndex = this.appliedSteps.length - 1;

    return {
      results: this.methodInstance.backSubstitute(),
      steps: this.appliedSteps.map((step) => step.toMetadata()),
      matrix:
        this.methodInstance instanceof InverseMethod
          ? {
              type: "inverse",
              adjusted: this.methodInstance.adjustedMatrix!.contents,
              inverse: this.methodInstance.inverseMatrix!.contents,
            }
          : {
              type: "standard",
              matrix: this.methodInstance.matrix!.contents,
            },
    };
  }

  skipAndFinishBackward(): MatrixConfiguration | null {
    if (!this.iterator || !this.methodInstance || !this.matrixInstance)
      return null;

    const methodType = getMethodTypeFromClass(this.methodInstance);

    if (this.methodInstance instanceof InverseMethod) {
      const initialMatrix = this.matrixInstance;
      this.reset();
      this.methodInstance = createSolutionMethodFromType(
        methodType,
        initialMatrix
      );
      this.matrixInstance = initialMatrix;
      this.iterator = this.methodInstance.getForwardSteps();
    } else {
      let revertedMatrix: number[][] = this.matrixInstance.contents;

      for (let i = this.appliedSteps.length - 1; i >= 0; i--) {
        const step = this.appliedSteps[i];
        revertedMatrix = step.inverse(revertedMatrix);
      }
      this.setMatrix(revertedMatrix);
    }

    this.setMethod(methodType);

    return this.methodInstance instanceof InverseMethod
      ? {
          type: "inverse",
          adjusted: this.methodInstance.adjustedMatrix!.contents,
          inverse: this.methodInstance.inverseMatrix!.contents,
        }
      : {
          type: "standard",
          matrix: this.matrixInstance.contents,
        };
  }

  getResult(): SolutionResult | null {
    return this.methodInstance?.backSubstitute() ?? null;
  }

  reset(): void {
    this.iterator = null;
    this.methodInstance = null;
    this.matrixInstance = null;
    this.appliedSteps = [];
    this.currentStepIndex = -1;
  }

  async generateRandomMatrix(
    rows: number,
    cols: number,
    from: number,
    to: number,
    precision: number
  ): Promise<number[][]> {
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        const randomValue = parseFloat(
          (Math.random() * (to - from) + from).toFixed(precision)
        );
        row.push(randomValue);
      }
      matrix.push(row);
    }
    return matrix;
  }

  async setMatrix(matrix: number[][]): Promise<void> {
    this.reset();
    this.matrixInstance = SlaeMatrix.fromNumbers(matrix);
    if (!this.methodType) return;
    this.setMethod(this.methodType);
  }
}

expose(new SolutionWorker());
