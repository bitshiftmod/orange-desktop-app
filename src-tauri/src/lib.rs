use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .icon_as_template(true)
                .menu(&menu)
                .menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => {
                        println!("quit menu item was clicked");
                        app.exit(0);
                    }
                    _ => {
                        println!("menu item {:?} not handled", event.id());
                    }
                })
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        position,
                        ..
                    } => {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let size = window.outer_size().unwrap();
                            // println!("outer size: {:?}", size);

                            let y_position = if position.y < (size.height as f64 / 2.0) {
                                0
                            } else {
                                (position.y - size.height as f64 - 20.0) as i32
                            };

                            let _ = window.set_position(tauri::Position::Physical(
                                tauri::PhysicalPosition {
                                    x: (position.x as f64 - size.width as f64 / 2.0) as i32,
                                    y: y_position,
                                },
                            ));

                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {
                        // println!("unhandled event {event:?}");
                    }
                })
                .build(app)?;

            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
                // Set an empty menu to hide the menu bar
                let menu = Menu::new(app)?;
                app.set_menu(menu)?;

                // Also set empty menu for the main window
                if let Some(window) = app.get_webview_window("main") {
                    window.set_menu(Menu::new(app)?)?;
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
