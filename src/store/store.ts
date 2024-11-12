import { Store } from "@tauri-apps/plugin-store";
import { Account, Algodv2 } from "algosdk";
import { create } from "zustand";
import { SavedAccount } from "../account";

// ZUSTAND IN-MEMORY GLOBAL STORE
export type NodeConfig = {
  token: string;
  url: string;
  port: number;
};

export enum OnMineAction {
  HODL,
  ADD_TO_LP,
}

export type MinerConfig = {
  tpm: number;
  fpt: number;
  onMine: OnMineAction;
  pairingAssetId?: number;
  lpAssetId: number;
};
export type GlobalState = {
  nodeConfig?: NodeConfig;
  algosdk?: Algodv2;
  store?: Store;
  minerWallet?: Account;
  savedAccount?: SavedAccount;
  minerConfig: MinerConfig;
  minerInterval?: NodeJS.Timeout;
  setStore: (store: Store) => Promise<void>;
  setNodeConfig: (config: NodeConfig) => Promise<void>;
  setMinerWallet: (account: Account) => Promise<void>;
  clearMinerWallet: () => Promise<void>;
  updateMinerConfig: (config: MinerConfig) => Promise<void>;
  setMinerInterval: (interval?: NodeJS.Timeout) => void;
};

export const useGlobalState = create<GlobalState>((set, get) => {
  return {
    minerConfig: {
      tpm: 60,
      fpt: 2000,
      onMine: OnMineAction.HODL,
      lpAssetId: 0,
    },
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

      let minerConfig = await store.get<MinerConfig>("minerConfig");
      if(!minerConfig) {
        minerConfig = {
          tpm: 60,
          fpt: 2000,
          onMine: OnMineAction.HODL,
          lpAssetId: 0,
        };
        await store.set("minerConfig", minerConfig);
        await store.save();
      }

      const savedAccount =
        (await store.get<SavedAccount>("savedAccount")) || undefined;

      const algosdk = nodeConfig.token
        ? new Algodv2(nodeConfig.token, nodeConfig.url, nodeConfig.port)
        : undefined;

      set({ store, nodeConfig, algosdk, savedAccount, minerConfig });
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
    updateMinerConfig: async (config: MinerConfig) => {

      const store = get().store;

      if (!store) {
        throw new Error("store is not set");
      }
      await store.set("minerConfig", config);
      await store.save();

      set({ minerConfig: config });
    },
    setMinerInterval: (interval?: NodeJS.Timeout) => {
      set({ minerInterval: interval });
    },
  };
});
