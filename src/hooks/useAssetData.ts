import { Algodv2, encodeAddress } from "algosdk";
import { useQuery } from "react-query";
import { MAINNET_APP_INDEX } from "../constants";
import { useGlobalState } from "../store/store";

type AssetData = {
  block: number;
  startTimestamp: number;
  totalEffort: number;
  totalTransactions: number;
  halving: number;
  halvingSupply: number;
  totalHalvingSupply: number;
  halvingProgress: number;
  minedSupply: number;
  minerReward: bigint;
  currentMiner: string;
  currentMinerEffort: number;
  lastMiner: string;
  lastMinerEffort: number;
  daysToHalving: number;
};

const createStateObject = (state: any, addressKeys: Set<string>) => {
  const obj: any = {};
  for (const kv of state) {
    // @ts-ignore
    const key = Buffer.from(kv["key"], "base64").toString();
    const value = kv["value"];

    // Check if value is a byte array or an integer
    if (value.type === 1) {
      // byte array
      obj[key] = addressKeys.has(key)
        ? //@ts-ignore
          encodeAddress(Buffer.from(kv.value.bytes, "base64"))
        : //@ts-ignore
          Buffer.from(value.bytes, "base64").toString();
    } else if (value.type === 2) {
      // integer
      obj[key] = value.uint;
    } else {
      throw new Error("Unknown value type: " + value);
    }

    // obj[key] = kv.value;
  }
  return obj;
};

const addressKeys = new Set(["last_miner", "current_miner"]);

export const readAssetData = async (
  client: Algodv2,
  applicationId: number
): Promise<AssetData> => {
  const data = await client.getApplicationByID(applicationId).do();
  const state = data["params"]["global-state"];
  const stateObj = createStateObject(state, addressKeys);
  const minerReward = stateObj["miner_reward"];
  // updateAverageCost(minereward / Math.pow(10, decimals));

  const totalSupply = 4_000_000;
  const halvingDenominator = 2 ^ (stateObj.halving || 0);
  const totalHalvingSupply = totalSupply / halvingDenominator;
  const halvingSupply = Number(stateObj["halving_supply"]) / 100_000_000;
  const halvingProgress =
    100 - (100 * (halvingSupply || 0)) / totalHalvingSupply;
  const daysToHalving = (2.86 * halvingSupply * 5) / (minerReward / 100_000_000 * 86400);

  return {
    block: stateObj["block"],
    startTimestamp: stateObj["start_timestamp"],
    totalEffort: stateObj["total_effort"],
    totalTransactions: stateObj["total_transactions"],
    halving: stateObj["halving"],
    halvingSupply,
    totalHalvingSupply,
    halvingProgress,
    minedSupply: Number(stateObj["mined_supply"]) / 100_000_000,
    minerReward,
    currentMiner: stateObj["current_miner"],
    currentMinerEffort: stateObj["current_miner_effort"],
    lastMiner: stateObj["last_miner"],
    lastMinerEffort: stateObj["last_miner_effort"],
    daysToHalving,
  };
};

const useAssetData = () => {
  const algosdk = useGlobalState((state) => state.algosdk);

  const res = useQuery(
    ["assetData", algosdk],
    () => {
      if (!algosdk) {
        throw new Error("algosdk is not set");
      }
      return readAssetData(algosdk, MAINNET_APP_INDEX);
    },
    {
      refetchInterval: 1000,
    }
  );

  return res;
};

export default useAssetData;
