import { useEffect, useState } from "react";
import { AssetInfo, getAssetInfo } from "../lib/token";
import { useGlobalState } from "../store/store";
import useAccountData from "./useAccountData";

export type BalanceInfo = {
  name: string;
  amount: number;
  assetInfo: AssetInfo;
};

export type Balances = {
  algo: number;
  assets: BalanceInfo[];
};

const useBalances = () => {
  const algosdk = useGlobalState((state) => state.algosdk);
  const minerWallet = useGlobalState((state) => state.minerWallet);
  const { data: accountData } = useAccountData(minerWallet?.addr.toString());

  const [balances, setBalances] = useState<Balances>();

  useEffect(() => {
    if (!accountData || !algosdk) {
      setBalances(undefined);
    } else {
      const update = async () => {
        const algo = Number(accountData.amount) / 1_000_000;

        const assets: BalanceInfo[] = [];
        for (let i = 0; i < accountData.assets.length; i++) {
          const asset = accountData.assets[i];
          const assetInfo = await getAssetInfo(algosdk, asset["asset-id"]);

          if (assetInfo.name) {
            assets.push({
              name: assetInfo.name,
              amount: asset.amount / Math.pow(10, assetInfo.decimals),
              assetInfo,
            });
          }
        }

        setBalances({ algo, assets });
      };
      update();
    }
  }, [accountData, setBalances, algosdk]);

  return balances;
};
export default useBalances;
