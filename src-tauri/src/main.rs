// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn process_album_marks(marks: Vec<i32>) -> f64{
    println!("Received marks: {:?}", marks);
    let sum: i32 = marks.iter().sum();
    let avg: f64 = sum as f64 / marks.len() as f64;
    return avg;   
}

fn main() {
    tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![process_album_marks])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  }