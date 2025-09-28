import { Store } from "@tauri-apps/plugin-store";
import { ReactElement, useEffect } from "react";
import { useGlobalState } from "./store";

const GlobalStateProvider = ({ children }: { children: ReactElement }) => {
  const setStore = useGlobalState((state) => state.setStore);

  useEffect(() => {
    // let cancelled = false;

    (async () => {
      const store = await Store.load("store.bin");

      // if (cancelled) {
      //   await store.close();
      //   return;
      // }

      await setStore(store);
    })();

    // return () => {
    //   cancelled = true;
    // };
  }, [setStore]);

  return <>{children}</>;
};

export default GlobalStateProvider;
