use nalgebra::DMatrix;

pub struct Matrix(pub DMatrix<f64>);

impl Matrix {
    pub fn new(rows: usize, cols: usize) -> Self {
        Matrix(DMatrix::zeros(rows, cols))
    }

    pub fn from_vec(vec: Vec<Vec<f64>>) -> Self {
        let rows = vec.len();
        let cols = if rows > 0 { vec[0].len() } else { 0 };
        let mut matrix = DMatrix::zeros(rows, cols);
        for (i, row) in vec.iter().enumerate() {
            for (j, &value) in row.iter().enumerate() {
                matrix[(i, j)] = value;
            }
        }
        Matrix(matrix)
    }

    pub fn random(rows: usize, cols: usize) -> Self {
        Matrix(DMatrix::from_fn(rows, cols, |_, _| rand::random::<f64>()))
    }

    pub fn cols(&self) -> usize {
        self.0.ncols()
    }

    pub fn rows(&self) -> usize {
        self.0.nrows()
    }

    pub fn get(&self, row: usize, col: usize) -> f64 {
        self.0[(row, col)]
    }
}
