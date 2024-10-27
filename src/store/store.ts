import { Store } from "@tauri-apps/plugin-store";
import { Account, Algodv2 } from "algosdk";
import { create } from "zustand";
import { SavedAccount } from "../account";
import { setMinerSettings } from "../pages/miner/mining";

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
  minerWallet?: Account;
  savedAccount?: SavedAccount;
  tpm: number;
  fpt: number;
  minerInterval?: NodeJS.Timeout;
  setStore: (store: Store) => Promise<void>;
  setNodeConfig: (config: NodeConfig) => Promise<void>;
  setMinerWallet: (account: Account) => Promise<void>;
  clearMinerWallet: () => Promise<void>;
  setTpm: (tpm: number) => void;
  setFpt: (fpt: number) => void;
  setMinerInterval: (interval?: NodeJS.Timeout) => void;
};

export const useGlobalState = create<GlobalState>((set, get) => {
  return {
    tpm: 60,
    fpt: 2000,
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

      const savedAccount =
        (await store.get<SavedAccount>("savedAccount")) || undefined;

      const algosdk = nodeConfig.token
        ? new Algodv2(nodeConfig.token, nodeConfig.url, nodeConfig.port)
        : undefined;

      set({ store, nodeConfig, algosdk, savedAccount });
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
    setMinerWallet: async (account: Account) => {
      const store = get().store;

      if (!store) {
        throw new Error("store is not set");
      }

      set({ minerWallet: account, savedAccount: undefined });
    },
    clearMinerWallet: async () => {
      const store = get().store;

      if (!store) {
        throw new Error("store is not set");
      }
      set({ minerWallet: undefined, savedAccount: undefined });
    },
    setTpm: (tpm: number) => {
      set({ tpm });
      setMinerSettings(tpm, get().fpt);
    },
    setFpt: (fpt: number) => {
      set({ fpt });
      setMinerSettings(get().tpm, fpt);
    },
    setMinerInterval: (interval?: NodeJS.Timeout) => {
      set({ minerInterval: interval });
    },
  };
});
