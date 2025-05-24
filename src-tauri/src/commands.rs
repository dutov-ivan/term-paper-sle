use rand::Rng;

#[tauri::command]
pub fn generate_matrix(from: f64, to: f64, rows: usize, cols: usize) -> Vec<Vec<f64>> {
    let mut rng = rand::rng();

    let mut matrix = vec![vec![0.0; cols]; rows];
    for row in matrix.iter_mut() {
        for value in row.iter_mut() {
            *value = rng.random_range(from..to);
        }
    }

    println!("Generated matrix: {:?}", matrix);

    matrix
}

