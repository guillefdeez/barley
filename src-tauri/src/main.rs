// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::{File, OpenOptions};
use std::io::{prelude::*, BufWriter};
use std::path::Path;


struct Album {
    title: String,
    artist: String,
    ntracks: usize,
    rating: f64,
}
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn process_album_marks(title: &str, artist: &str, marks: Vec<i32>){
    let album = Album {
        title: title.to_string(),
        artist: artist.to_string(),
        ntracks: marks.len(),
        rating: marks.iter().sum::<i32>() as f64 / marks.len() as f64,
    };
    let line = format!("{},{},{},{}\n", album.title, album.artist, album.ntracks, album.rating);
    match Path::new("../albums.csv").try_exists(){
        Ok(false)=> {
            let file = File::create("../albums.csv")
                .expect("Error al crear archivo");
            let mut file = BufWriter::new(file);
            file.write_all(b"Title,Artist,Tracks,Rating\n").expect("Error al escribir al archivo");
            file.write_all(line.as_bytes()).expect("Error al escribir al archivo");
            file.write_all(b"\n").expect("Error al escribir al archivo");
        }
        Ok(true)=>{
            let file = OpenOptions::new()
                .append(true)
                .open("../albums.csv")
                .expect("Unable to open file");
            let mut file = BufWriter::new(file);
            file.write_all(line.as_bytes()).expect("Unable to write data");
            file.write_all(b"\n").expect("Unable to write newline"); // Add a newline character
        }
        Err(_)=>println!("Error al comprobar si el archivo existe")
    };
    println!("Album processed");
}

fn main() {
    tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![process_album_marks])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  }