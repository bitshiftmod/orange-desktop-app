import algosdk from "algosdk";
import { useQuery } from "react-query";
import { keyToAddress, keyToValue } from "../utils";
import { MAINNET_APP_INDEX } from "../constants";

// FIXME - put this into a global state management system
const nodeUrl = "http://localhost";
const nodePort = 8080;
const client = new algosdk.Algodv2(
  "c7288ede8085549a8882ec246054b6eafca327898b3a01adf7180c9efb85ccab",
  nodeUrl,
  nodePort
);

type AppData = {
  manager: string;
  miningApplication: number;
  miningToken: number;
  poolAddress: string;
  poolApplication: number;
  poolToken: number;
  minDeposit: number;
  baseTxnFee: number;
  marketRateBps: number;
  totalDeposited: number;
  totalSpent: number;
  rewardBalance: number;
  totalWithdrawn: number;
  lastSpent: number;
  lastRewards: number;
  spentPerToken: bigint;
  rewardPerToken: bigint;
  lastPriceRound: number;
};

type PoolData = {
  reservesA: number;
  reservesB: number;
  tokens: number;
};

type AccountData = {
  balance: number;
  assetBalance: number;
  assetOptedIn?: boolean;
};

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

type BoxData = {
  deposited: number;
  depositedAt: number;
  spentPerToken: bigint;
  rewardPerToken: bigint;
  totalSpent: number;
  totalWithdrawn: number;
  claimable: number;
};

type StakingProps = {
  nodeUrl: string;
  nodePort: number;
  indexerUrl: string;
  indexerPort: number;
  applicationId: number;
  assetId: number;
  isMainnet?: boolean;
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
  client: any,
  applicationId: number
): Promise<AssetData> => {
  const data = await client.getApplicationByID(applicationId).do();
  const state = data["params"]["globalState"];
  const stateObj = createStateObject(state);
  const minerReward = Number(stateObj["miner_reward"]) / 100_000_000;
  // updateAverageCost(minereward / Math.pow(10, decimals));

  const totalSupply = 4_000_000;
  const halvingDenominator = 2 ^ (state.halving || 0);
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
  const res = useQuery(
    "assetData",
    () => readAssetData(client, MAINNET_APP_INDEX),
    {
      refetchInterval: 3000,
    }
  );

  return res;
};

export default useAssetData;
