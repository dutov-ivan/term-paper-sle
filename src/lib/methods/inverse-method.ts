import type { Step } from "../steps/step";
import type { SolutionResult } from "../solution/solution-result";
import { Method } from "./Method";
import type { SlaeMatrix } from "../math/slae-matrix";
import { SquareMatrix } from "../math/SquareMatrix";
import { JordanGaussStepper } from "./jordan-gauss-stepper";
import {
  SolutionResultEnum,
  type SolutionResultType,
} from "../solution/solution-result-type";

export class InverseMethod extends Method {
  private _adjustedMatrix: SquareMatrix;
  private _inverseMatrix: SquareMatrix;

  private _matrixStepper: JordanGaussStepper;
  private _rhs: number[];

  public get inverseMatrix(): SquareMatrix {
    return this._inverseMatrix;
  }

  public get adjustedMatrix(): SquareMatrix {
    return this._adjustedMatrix;
  }

  constructor(matrix: SlaeMatrix) {
    super(matrix);
    this._adjustedMatrix = matrix.toSquareMatrix();
    this._inverseMatrix = SquareMatrix.identity(matrix.rows);
    this._matrixStepper = new JordanGaussStepper(
      this._adjustedMatrix,
      this.methodMetadata
    );
    this._rhs = new Array(matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      this._rhs[i] = matrix.get(i, matrix.cols - 1);
    }
  }

  getForwardSteps(): IterableIterator<Step> {
    if (!this._adjustedMatrix) {
      throw new Error("Matrix not initialized");
    }
    const innerIterator = this._matrixStepper.getForwardSteps();
    const inverseMatrix = this._inverseMatrix;
    const metadata = this.methodMetadata;

    function* wrapper(): IterableIterator<Step> {
      for (const step of innerIterator) {
        step.perform(inverseMatrix);
        metadata.elementaryOperations++;
        metadata.iterations += step.iterations;
        yield step;
      }
    }
    this.iterator = wrapper();
    return this.iterator;
  }

  backSubstitute(): SolutionResult {
    if (!this._adjustedMatrix) {
      throw new Error("Matrix not initialized");
    }

    const solutionType = this.analyzeEchelonForm(this._adjustedMatrix);
    if (solutionType !== SolutionResultEnum.Unique) {
      return {
        result: solutionType,
        description:
          solutionType === SolutionResultEnum.NoneOrInfinite
            ? "Couldn't find inverse matrix. Cannot solve."
            : undefined,
      };
    }

    const roots = this._inverseMatrix.multiplyByVector(this._rhs);
    this.methodMetadata.backSubstitutionOperations +=
      this._inverseMatrix.rows * this._inverseMatrix.cols;

    return {
      result: SolutionResultEnum.Unique,
      roots: roots,
    };
  }

  public analyzeEchelonForm(matrix: SquareMatrix): SolutionResultType {
    const rows = matrix.rows;

    for (let row = 0; row < rows; row++) {
      const isZeroRow = this._adjustedMatrix.get(row, row) === 0;
      this.methodMetadata.iterations++;
      if (isZeroRow) {
        return SolutionResultEnum.NoneOrInfinite;
      }
    }

    return SolutionResultEnum.Unique;
  }
}
