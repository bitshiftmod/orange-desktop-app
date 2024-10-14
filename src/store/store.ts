import { Algodv2 } from "algosdk";
import { create } from "zustand";
import { Store } from "@tauri-apps/plugin-store";

// ZUSTAND IN-MEMORY GLOBAL STORE
export type NodeConfig = {
  token: string;
  url: string;
  port: number;
};
export type GlobalState = {
  nodeConfig?: NodeConfig;
  algosdk?: Algodv2;
  store?: Store;
  setStore: (store: Store) => Promise<void>;
  setNodeConfig: (config: NodeConfig) => Promise<void>;
};

export const useGlobalState = create<GlobalState>((set, get) => {
  return {
    setStore: async (store: Store) => {
      let nodeConfig = await store.get<NodeConfig>("nodeConfig");

      if (!nodeConfig) {
        nodeConfig = {
          token: "",
          url: "http://localhost",
          port: 8080,
        };
        await store.set("nodeConfig", nodeConfig);
        await store.save();
      }

      const algosdk = nodeConfig.token
        ? new Algodv2(nodeConfig.token, nodeConfig.url, nodeConfig.port)
        : undefined;

      set({ store, nodeConfig, algosdk });
    },
    setNodeConfig: async (nodeConfig: NodeConfig) => {
      const store = get().store;

      if (!store) {
        throw new Error("store is not set");
      }
      await store.set("nodeConfig", nodeConfig);
      await store.save();

      const algosdk = nodeConfig.token
        ? new Algodv2(nodeConfig.token, nodeConfig.url, nodeConfig.port)
        : undefined;

      set({
        nodeConfig,
        algosdk,
      });
    },
  };
});
