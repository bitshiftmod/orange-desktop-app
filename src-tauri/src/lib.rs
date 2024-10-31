use tauri::Manager;

#[cfg(not(target_os = "linux"))]
use tauri::menu::{Menu, MenuItem};
#[cfg(not(target_os = "linux"))]
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
#[cfg(not(target_os = "linux"))]
use tauri_plugin_positioner::{Position, WindowExt};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .on_window_event(|window, event| match event {
            #[cfg(not(target_os = "linux"))]
            tauri::WindowEvent::Focused(focused) => {
                if !focused {
                    let _ = window.hide();
                }
            }
            _ => {}
        })
        .setup(|app| {
            #[cfg(target_os = "linux")]
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_decorations(true);
                let _ = window.set_title("Orange Desktop App");
                let _ = window.set_closable(true);
                let _ = window.set_skip_taskbar(false);
                let _ = window.center();
                let _ = window.show();
            }

            #[cfg(not(target_os = "linux"))]
            {
                let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
                let menu = Menu::with_items(app, &[&quit_i])?;
                let _tray = TrayIconBuilder::new()
                    .icon(app.default_window_icon().unwrap().clone())
                    .icon_as_template(true)
                    .menu(&menu)
                    .menu_on_left_click(false)
                    .on_menu_event(|app, event| match event.id().as_ref() {
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {
                            println!("menu item {:?} not handled", event.id());
                        }
                    })
                    .on_tray_icon_event(|tray_handle, event| {
                        tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);

                        match event {
                            TrayIconEvent::Click {
                                button: MouseButton::Left,
                                button_state: MouseButtonState::Up,
                                ..
                            } => {
                                let app = tray_handle.app_handle();
                                if let Some(window) = app.get_webview_window("main") {
                                    let _ =
                                        window.as_ref().window().move_window(Position::TrayCenter);
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }

                            _ => {}
                        }
                    })
                    .build(app)?;
            }

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
