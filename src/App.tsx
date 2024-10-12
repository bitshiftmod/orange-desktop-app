import { useEffect} from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
// import { createTray } from "./tray";
import { getCurrentWindow } from "@tauri-apps/api/window";
import BottomNav from "./BottomNav";

function App() {
  useEffect(() => {
    getCurrentWindow().onFocusChanged((focused) => {
      if (!focused) {
        getCurrentWindow().hide();
      }
    });
  }, []);

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-full grow">
        {/* <img src="orange.svg" className="size-8"/>
      <div className="text-orange-800 w-full text-center text-2xl font-bold">Orange</div> */}

        {/* <Chart assetId={1284444444} width={400} height={500}/> */}
        <iframe
          title="Vestige Widget"
          src="https://vestige.fi/widget/1284444444/chart"
          // src="https://vestige.fi/asset/1284444444"
          className="w-full h-full"
        />
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
