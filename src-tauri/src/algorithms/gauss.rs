use crate::{
    algorithms::common::{Algorithm, AlgorithmMetadata},
    matrix::Matrix,
    steps::Step,
};

enum Stage {
    PivotSwap,
    RowElimination,
}

pub struct GaussAlgorithm {
    metadata: AlgorithmMetadata,
    matrix: Matrix,
    processing_row: usize,
    eliminating_row: Option<usize>,
    stage: Stage,
}

impl Algorithm for GaussAlgorithm {
    fn new(matrix: Matrix) -> Self {
        Self {
            metadata: AlgorithmMetadata::new(),
            matrix,
            processing_row: 0,
            stage: Stage::PivotSwap,
            eliminating_row: None,
        }
    }

    fn metadata(&self) -> &AlgorithmMetadata {
        &self.metadata
    }

    fn forward(&mut self) -> Option<Step> {
        if self.processing_row >= self.matrix.rows() {
            return None;
        }

        match self.stage {
            Stage::PivotSwap => {
                if self.processing_row == self.matrix.rows() - 1 {
                    self.processing_row += 1;
                    return self.forward();
                }
                let mut pivot_row = self.processing_row;
                for row in (pivot_row + 1)..self.matrix.rows() {
                    if self.matrix.get(row, self.processing_row)
                        > self.matrix.get(pivot_row, self.processing_row)
                    {
                        pivot_row = row;
                    }
                }

                self.metadata.comparisons +=
                    self.matrix.rows() as u32 - self.processing_row as u32 - 1;
                self.metadata.sets += 1;

                // If there's no better pivot, start eliminating
                if self.processing_row == pivot_row {
                    self.stage = Stage::RowElimination;
                    return self.forward();
                }

                let step = self.matrix.swap_rows(self.processing_row, pivot_row);

                self.stage = Stage::RowElimination;
                Some(Step::SwapRows(step))
            }
            Stage::RowElimination => {
                if self.eliminating_row.is_none() {
                    self.eliminating_row = Some(self.processing_row + 1);
                }

                let row = self.eliminating_row.unwrap();

                let step = self.matrix.eliminate(self.processing_row, row).ok()?;

                self.metadata.elementary_operations += 1;
                self.metadata.sets += self.matrix.rows() as u32 - self.processing_row as u32 - 1;

                if row + 1 >= self.matrix.rows() {
                    self.processing_row += 1;
                    self.eliminating_row = None;
                    self.stage = Stage::PivotSwap;
                } else {
                    self.eliminating_row = Some(row + 1);
                }

                Some(Step::Eliminate(step))
            }
        }
    }

    fn back(&mut self) {
        todo!()
    }

    fn back_substitute(&self) -> nalgebra::DVector<f64> {
        todo!()
    }
}

pub mod test {

    use crate::steps::EliminateStep;

    use super::*;

    #[test]
    fn steps_properly() {
        let matrix = Matrix::from_vec(vec![vec![1.0, 2.0, 5.0], vec![1.0, 1.0, 3.0]]);

        let mut algorithm = GaussAlgorithm::new(matrix);
        let first_step = algorithm.forward().unwrap();
        assert_eq!(
            first_step,
            Step::Eliminate(EliminateStep {
                source_row: 0,
                target_row: 1,
                factor: 1.0,
            })
        );
        let second_step = algorithm.forward();
        assert_eq!(second_step, None);
    }
}
