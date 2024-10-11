// use tauri::menu::{Menu, MenuItem};
// use tauri::tray::TrayIconBuilder;
// use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .setup(|app| {
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            Ok(())
        })
        // .setup(|app| {
        //     let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
        //     let menu = Menu::with_items(app, &[&quit_i])?;
        //     let tray = TrayIconBuilder::new()
        //         .menu(&menu)
        //         .menu_on_left_click(true)
        //         .build(app)?;
        //     Ok(())
        // })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
