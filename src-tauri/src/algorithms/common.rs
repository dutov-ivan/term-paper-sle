use nalgebra::DVector;

use crate::{matrix::Matrix, steps::Step};

pub struct AlgorithmMetadata {
    pub comparisons: u32,
    pub sets: u32,
    pub elementary_operations: u32,
    pub back_substitution_operations: u32,
}

impl AlgorithmMetadata {
    pub fn new() -> Self {
        Self {
            comparisons: 0,
            sets: 0,
            elementary_operations: 0,
            back_substitution_operations: 0,
        }
    }
}

pub trait Algorithm {
    fn new(matrix: Matrix) -> Self;
    fn metadata(&self) -> &AlgorithmMetadata;
    fn forward(&mut self) -> Option<Step>;
    fn back(&mut self);
    fn back_substitute(&self) -> DVector<f64>;
}
