import {
    AddLiquidity,
    ALGO_ASSET_ID,
    combineAndRegroupSignerTxns,
    generateOptIntoAssetTxns,
    poolUtils,
    SignerTransaction,
    SupportedNetwork,
    Swap,
    SwapType,
} from "@tinymanorg/tinyman-js-sdk";
import { Account, Algodv2 } from "algosdk";
import { MAINNET_ASSET_INDEX } from "../constants";
import { useGlobalState } from "../store/store";
import signerWithSecretKey from "./initiatorSigner";

export const supportedLPTokens = [
  { id: 0, name: "Algo" },
  { id: 700965019, name: "VEST" },
  { id: 796425061, name: "COOP" },
];

export type AssetInfo = {
  id: number;
  decimals: number;
  name?: string;
  total: bigint;
  unitName?: string;
};

const assetInfoMemDb = new Map<number, AssetInfo>();

export const getAssetInfo = async (
  algosdk: Algodv2,
  assetId: number
): Promise<AssetInfo> => {
  if (assetInfoMemDb.has(assetId)) {
    return assetInfoMemDb.get(assetId)!;
  }

  const store = useGlobalState.getState().store;

  if (!store) {
    throw new Error("Unable to read store from global state");
  }

  let assetInfo = await store.get<AssetInfo>(`asset-${assetId}`);

  if (!assetInfo) {
    const asset = await algosdk.getAssetByID(assetId).do();
    const { decimals, name, total, unitName } = asset.params;
    assetInfo = { id: assetId, decimals, name, total, unitName };

    store.set(`asset-${assetId}`, assetInfo);
  }

  assetInfoMemDb.set(assetId, assetInfo);
  return assetInfo;
};

export const isAccountOptedIntoAsset = async (
  algosdk: Algodv2,
  accountAddress: string,
  assetId: number
): Promise<Boolean> => {
  if (assetId === ALGO_ASSET_ID) {
    return true;
  }

  const accountInfo = await algosdk.accountInformation(accountAddress).do();
  return (
    accountInfo.assets.some(
      (asset: { [x: string]: number }) => asset["asset-id"] == assetId
    ) || false
  );
};

export const createFixedOutputSwapTxns = async ({
  algosdk,
  account,
  assetIn,
  assetOut,
  amount,
}: {
  algosdk: Algodv2;
  account: Account;
  assetIn: { id: number; decimals: number };
  assetOut: { id: number; decimals: number };
  amount: number;
}) => {
  const initiatorAddr = account.addr;
  const pool = await poolUtils.v2.getPoolInfo({
    network: "mainnet" as SupportedNetwork,
    client: algosdk,
    asset1ID: Number(assetIn.id),
    asset2ID: Number(assetOut.id),
  });

  const fixedOutputSwapQuote = await Swap.v2.getFixedOutputSwapQuote({
    amount,
    pool,
    assetIn,
    assetOut,
    network: "mainnet" as SupportedNetwork,
    isSwapRouterEnabled: true,
  });

  let fixedOutputSwapTxns = await Swap.v2.generateTxns({
    client: algosdk,
    network: "mainnet" as SupportedNetwork,
    quote: fixedOutputSwapQuote,
    swapType: SwapType.FixedOutput,
    initiatorAddr,
    slippage: 0.05,
  });

  const assetOptedIn = await isAccountOptedIntoAsset(
    algosdk,
    initiatorAddr,
    assetOut.id
  );
  if (!assetOptedIn) {
    /**
     * Insert opt-in transaction to the txn group
     * if the account is not opted-in to the asset 
     */
    fixedOutputSwapTxns = combineAndRegroupSignerTxns(
      await generateOptIntoAssetTxns({
        client: algosdk,
        assetID: assetOut.id,
        initiatorAddr,
      }),
      fixedOutputSwapTxns
    );
  }

  return fixedOutputSwapTxns;
};

// based on https://github.com/tinymanorg/tinyman-js-sdk/blob/main/examples/src/operation/add-liquidity/addFlexibleLiquidity.ts
export const addToLP = async (
  algosdk: Algodv2,
  account: Account,
  oraAmount: bigint,
  pairAssetId: number
) => {
  const initiatorAddr = account.addr;
  const poolInfo = await poolUtils.v2.getPoolInfo({
    network: "mainnet",
    client: algosdk,
    asset1ID: MAINNET_ASSET_INDEX,
    asset2ID: pairAssetId,
  });

  const pairAssetAmount = Math.floor(
    (Number(oraAmount) / Number(poolInfo.asset1Reserves)) *
      Number(poolInfo.asset2Reserves)
  );

  let fixedOutputSwapTxns: SignerTransaction[] | undefined = undefined;

  let decimals = 6; // default to ALGO

  if (pairAssetId !== ALGO_ASSET_ID) {
    const assetInfo = await getAssetInfo(algosdk, pairAssetId);
    decimals = assetInfo.decimals;

    fixedOutputSwapTxns = await createFixedOutputSwapTxns({
      algosdk,
      account,
      assetIn: { id: ALGO_ASSET_ID, decimals: 8 },
      assetOut: assetInfo,
      amount: Number(pairAssetAmount),
    });
  }

  // Get a quote for the desired add amount
  const quote = AddLiquidity.v2.flexible.getQuote({
    pool: poolInfo,
    asset1: {
      amount: oraAmount,
      decimals: 8,
    },
    asset2: {
      amount: Math.floor(pairAssetAmount),
      decimals: decimals,
    },
  });

  let addFlexibleLiqTxns = await AddLiquidity.v2.flexible.generateTxns({
    network: "mainnet" as SupportedNetwork,
    client: algosdk,
    initiatorAddr,
    poolAddress: poolInfo.account.address(),
    asset1In: quote.asset1In,
    asset2In: quote.asset2In,
    poolTokenOut: quote.poolTokenOut,
    minPoolTokenAssetAmount: quote.minPoolTokenAssetAmountWithSlippage,
  });

  const lpAccountOptedIn = await isAccountOptedIntoAsset(
    algosdk,
    initiatorAddr,
    poolInfo.poolTokenID!
  );
  if (!lpAccountOptedIn) {
    /**
     * Insert opt-in transaction to the txn group
     * if the account is not opted-in to the pool token
     */
    addFlexibleLiqTxns = combineAndRegroupSignerTxns(
      await generateOptIntoAssetTxns({
        client: algosdk,
        assetID: poolInfo.poolTokenID!,
        initiatorAddr,
      }),
      addFlexibleLiqTxns
    );
  }

  if (fixedOutputSwapTxns) {
    addFlexibleLiqTxns = combineAndRegroupSignerTxns(
      fixedOutputSwapTxns,
      addFlexibleLiqTxns
    );
  }

  const signedTxns = await AddLiquidity.v2.flexible.signTxns({
    txGroup: addFlexibleLiqTxns,
    initiatorSigner: signerWithSecretKey(account),
  });

  const executionResponse = await AddLiquidity.v2.flexible.execute({
    client: algosdk,
    txGroup: addFlexibleLiqTxns,
    signedTxns,
    pool: poolInfo,
  });

  console.log("✅ Add Flexible Liquidity executed successfully!");
  console.log({ txnID: executionResponse.txnID });
};
