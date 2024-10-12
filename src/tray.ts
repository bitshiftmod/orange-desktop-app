import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon, TrayIconOptions } from "@tauri-apps/api/tray";
import { getCurrentWindow, PhysicalPosition } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";

export const createTray = async () => {
  const menu = await Menu.new({
    items: [
      {
        id: "open",
        text: "Open Window",
      },
      {
        id: "quit",
        text: "Quit",
        action: async () => {
          invoke("exit_app");
        },
      },
    ],
  });

  const options: TrayIconOptions = {
    menu,
    icon: "icons/orange_20x20.png",
    iconAsTemplate: true,
    menuOnLeftClick: false,
    action: async (e) => {
      const currentWindow = getCurrentWindow();
      if (e.type == "Click") {
        const size = await currentWindow.outerSize();
        await currentWindow.setPosition(new PhysicalPosition(Math.floor(e.position.x - size.width/ 2), Math.floor(e.rect.size.height) + 10));
        await currentWindow.setFocus();
        await currentWindow.show();
      }

      //   switch (e.id) {
      //     case "open":
      //       await currentWindow.setPosition(new LogicalPosition(e.position.x, 0));
      //       await currentWindow.show();
      //       break;
      //     case "quit":
      //         invoke('exit_app');
      //       break;
      //     default:
      //       break;
      //   }
    },
  };

  const tray = await TrayIcon.new(options);
  return tray;
};
