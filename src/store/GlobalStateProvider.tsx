import { createStore } from "@tauri-apps/plugin-store";
import { ReactElement, useEffect } from "react";
import useAssetData from "../hooks/useAssetData";
import { setLastMinerAddress } from "../pages/miner/mining";
import { useGlobalState } from "./store";

const GlobalStateProvider = ({ children }: { children: ReactElement }) => {
  const setStore = useGlobalState((state) => state.setStore);

  const { data: assetData } = useAssetData();

  useEffect(() => {
    setLastMinerAddress(assetData?.lastMiner || "");
  }, [assetData]);

  useEffect(() => {
    createStore(
      "store.bin"
      // Seems to be a bug in plugin-store, using boolean value for autoSave throws an error that it expects u64
      // , { autoSave: true }
    ).then((store) => setStore(store));
  }, []);

  return <>{children}</>;
};

export default GlobalStateProvider;
