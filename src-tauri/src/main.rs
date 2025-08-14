// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod algorithms;
mod matrix;
mod steps;
fn main() {
    app_lib::run();
}
