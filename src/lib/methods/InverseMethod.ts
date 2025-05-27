import type { Step } from "../steps/Step";
import type { SolutionResult } from "../solution/SolutionResult";
import { Method } from "./Method";
import type { SlaeMatrix } from "../math/slae-matrix";
import { SquareMatrix } from "../math/SquareMatrix";
import { JordanGaussStepper } from "./JordanGaussStepper";
import { SolutionResultType } from "../solution/SolutionResultType";
import { isNearZero } from "../math/utils";

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
    this._matrixStepper = new JordanGaussStepper(this._adjustedMatrix);
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

    function* wrapper(): IterableIterator<Step> {
      for (const step of innerIterator) {
        step.perform(inverseMatrix);
        yield step;
      }
    }
    this._iterator = wrapper();
    return this._iterator;
  }

  backSubstitute(): SolutionResult {
    if (!this._adjustedMatrix) {
      throw new Error("Matrix not initialized");
    }

    const solutionType = this.analyzeEchelonForm(this._adjustedMatrix);
    if (solutionType !== SolutionResultType.Unique) {
      return {
        result: solutionType,
        description:
          solutionType === SolutionResultType.NoneOrInfinite
            ? "Couldn't find inverse matrix. Cannot solve."
            : undefined,
      };
    }

    const roots = this._inverseMatrix.multiplyByVector(this._rhs);

    return {
      result: SolutionResultType.Unique,
      roots: roots,
    };
  }

  public analyzeEchelonForm(matrix: SquareMatrix): SolutionResultType {
    const rows = matrix.rows;
    const cols = matrix.cols;

    for (let row = 0; row < rows; row++) {
      const isZeroRow = this.isZeroRow(matrix, row, cols);
      if (isZeroRow) {
        return SolutionResultType.NoneOrInfinite;
      }
    }

    return SolutionResultType.Unique;
  }

  private isZeroRow(matrix: SquareMatrix, row: number, cols: number): boolean {
    for (let col = 0; col < cols; col++) {
      if (!isNearZero(matrix.get(row, col))) return false;
    }
    return true;
  }
}
