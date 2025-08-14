use nalgebra::DMatrix;

use crate::matrix::Matrix;

pub trait StepPrinter {
    fn print_step(&self);
}

#[derive(Debug, PartialEq)]
pub enum Step {
    SwapRows(SwapRowsStep),
    ScaleRow(ScaleRowStep),
    Eliminate(EliminateStep),
}

#[derive(Debug, PartialEq)]
pub struct SwapRowsStep {
    pub source_row: usize,
    pub target_row: usize,
}

#[derive(Debug, PartialEq)]
pub struct ScaleRowStep {
    pub source_row: usize,
    pub factor: f64,
}

#[derive(Debug, PartialEq)]
pub struct EliminateStep {
    pub source_row: usize,
    pub target_row: usize,
    pub factor: f64,
}

impl Matrix {
    pub fn swap_rows(&mut self, row1: usize, row2: usize) -> SwapRowsStep {
        self.0.swap_rows(row1, row2);
        SwapRowsStep {
            source_row: row1,
            target_row: row2,
        }
    }

    pub fn scale_row(&mut self, row: usize, factor: f64) -> ScaleRowStep {
        let mut row_mut = self.0.row_mut(row);
        row_mut.iter_mut().for_each(|x| *x *= factor);
        ScaleRowStep {
            source_row: row,
            factor,
        }
    }

    pub fn eliminate(&mut self, row: usize, target_row: usize) -> Result<EliminateStep, ()> {
        let pivot = self.0[(row, row)];

        if pivot == 0.0 {
            return Err(());
        }

        let factor = self.0[(target_row, row)] / pivot;

        let ncols = self.0.ncols();
        let source_row = self.0.row(row).as_ptr(); // immutable borrow
        let target_row_mut = self.0.row_mut(target_row).as_mut_ptr();

        for col in 0..ncols {
            unsafe {
                *target_row_mut.add(col) -= factor * *source_row.add(col);
            }
        }

        Ok(EliminateStep {
            source_row: row,
            target_row,
            factor,
        })
    }
}
