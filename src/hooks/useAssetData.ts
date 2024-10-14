import { useQuery } from "react-query";
import { MAINNET_APP_INDEX } from "../constants";
import { useGlobalState } from "../store/store";
import { Algodv2 } from "algosdk";

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
  minerReward: number;
  lastMiner: string;
  daysToHalving: number;
};

const createStateObject = (state: any) => {
  const obj: any = {};
  for (const kv of state) {
    // @ts-ignore
    const key = Buffer.from(kv["key"], "base64").toString();
    const value = kv["value"];

    // Check if value is a byte array or an integer
    if (value.type === 1) {
      // byte array
      //@ts-ignore
      obj[key] = Buffer.from(value.bytes, "base64").toString();
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

const readAssetData = async (
  client: Algodv2,
  applicationId: number
): Promise<AssetData> => {
  const data = await client.getApplicationByID(applicationId).do();
  const state = data["params"]["globalState"];
  const stateObj = createStateObject(state);
  const minerReward = Number(stateObj["miner_reward"]) / 100_000_000;
  // updateAverageCost(minereward / Math.pow(10, decimals));

  const totalSupply = 4_000_000;
  const halvingDenominator = 2 ^ (stateObj.halving || 0);
  const totalHalvingSupply = totalSupply / halvingDenominator;
  const halvingSupply = Number(stateObj["halving_supply"]) / 100_000_000;
  const halvingProgress =
    100 - (100 * (halvingSupply || 0)) / totalHalvingSupply;
  const daysToHalving = (2.86 * halvingSupply * 5) / (minerReward * 86400);

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
    lastMiner: stateObj["last_miner"],
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
      refetchInterval: 3000,
    }
  );

  return res;
};

export default useAssetData;
