import algosdk, {
  Account,
  Algodv2,
  signTransaction,
  Transaction,
} from "algosdk";
import { MAINNET_APP_INDEX, MAINNET_ASSET_INDEX } from "../../constants";

import dayjs from "dayjs";
import abi from "../../abi/OrangeCoin.arc4.json";

// global miner state
// stored here for convenience for setInterval callback
export let txIndex = 0;
export let transactionsToSend = 0;
export let miningMinute = 0;
export let miningSecond = 0;
export let lastMinerAddress = "";

export declare type SignedTransaction = {
  txID: string;
  blob: Uint8Array;
};

const signTransactions = async (
  account: Account,
  group: Transaction[]
): Promise<SignedTransaction[]> => {
  return group.map((txn) => {
    return signTransaction(txn, account.sk);
  });
};

const signAndSendMinerTransactions = async (
  client: Algodv2,
  account: Account,
  txns: Transaction[]
) => {
  try {
    const signedTxs = await signTransactions(account, txns);
    const { txid } = await client
      .sendRawTransaction(signedTxs.map((b) => b.blob))
      .do();
    await algosdk.waitForConfirmation(client, txid, 5);
  } catch(e) {
    console.error(e)
    throw new Error("Failed to sign transactions.");
  }
};
export const optIn = async (
  client: Algodv2,
  account: Account,
  app: boolean,
  asset: boolean
) => {
  try {
    const suggestedParams = await client.getTransactionParams().do();
    const txns = [];
    if (app) {
      txns.push(
        algosdk.makeApplicationOptInTxnFromObject({
          sender: account.addr || "",
          appIndex: MAINNET_APP_INDEX,
          suggestedParams,
        })
      );
    }
    if (asset) {
      txns.push(
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          sender: account.addr,
          receiver: account.addr,
          assetIndex: MAINNET_ASSET_INDEX,
          amount: 0,
          suggestedParams,
        })
      );
    }
    if (txns.length > 1) algosdk.assignGroupID(txns);
    signAndSendMinerTransactions(client, account, txns);
  } catch (e: any) {
    // toast.error(e?.toString());
    throw e;
  }
};

// const withdraw = async () => {
//   signAndSendMinerTransactions([
//     algosdk.makePaymentTxnWithSuggestedParamsFromObject({
//       from: address,
//       to: activeAccount?.address || address,
//       amount: minerBalance,
//       closeRemainderTo: activeAccount?.address || address,
//       suggestedParams: await client.getTransactionParams().do(),
//     }),
//   ]).then(() => updateMinerData(address));
// };

export const mine = async (
  client: Algodv2,
  account: Account,
  tpm: number,
  fpt: number
) => {
  const minerSigner = async (
    group: algosdk.Transaction[]
  ): Promise<Uint8Array[]> => {
    const blobs = await signTransactions(account, group);
    return blobs.map((b) => b.blob);
  };

  const mAddress = account.addr;
  const dAddress = account.addr;

  const suggestedParams = await client.getTransactionParams().do();
  const contract = new algosdk.ABIContract(abi);
  const method = contract.getMethodByName("mine");
  suggestedParams.flatFee = true;
  suggestedParams.fee = BigInt(fpt);

  let currentMinute = dayjs().unix();
  currentMinute = currentMinute - (currentMinute % 60);
  if (miningMinute !== currentMinute) {
    transactionsToSend = tpm;
    miningMinute = currentMinute;
    miningSecond = 1;
  }
  let amount = 0;
  const interval = tpm < 60 ? Math.floor(60 / tpm) : 1;
  if (miningSecond % interval === 0) {
    amount = Math.min(transactionsToSend, Math.ceil(tpm / (60 / interval)));
  }
  transactionsToSend -= amount;
  miningSecond += 1;

  while (amount > 0) {
    const groupSize = amount > 16 ? 16 : amount;
    amount -= groupSize;
    const atc = new algosdk.AtomicTransactionComposer();
    for (let i = 0; i < groupSize; i += 1) {
      //   setPendingTxs((txs) => txs + 1);
      txIndex += 1;
      atc.addMethodCall({
        appID: MAINNET_APP_INDEX,
        method,
        methodArgs: [dAddress.publicKey],
        appAccounts: [lastMinerAddress, dAddress],
        appForeignAssets: [MAINNET_ASSET_INDEX],
        sender: mAddress,
        signer: minerSigner,
        note: Uint8Array.from([txIndex]),
        suggestedParams,
      });
    }
    // @ts-ignore
    const atcTransactions = atc.transactions.map((tx) => tx.txn);
    if (atcTransactions.length > 1) algosdk.assignGroupID(atcTransactions);
    signAndSendMinerTransactions(client, account, atcTransactions);
    //   .then(() => updateMinerData(address))
    //   .finally(() => setPendingTxs((txs) => txs - groupSize));
  }
};

export const setLastMinerAddress = (address: string) => {
  lastMinerAddress = address;
};
