// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod epub;
use epub::Epub;
use tauri::{AppHandle, Manager};

#[tauri::command]
fn get_meta(meta: epub::Metadata, app_handel: AppHandle) -> String {
    let mut epub = Epub::new(meta);
    match epub.generate_epub(|payload| match app_handel.emit_all("progress", payload) {
        Ok(c) => c,
        _ => panic!("通信失败"),
    }) {
        Ok(_) => String::from("OK"),
        _ => String::from("Err"),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_meta])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
