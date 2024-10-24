import { useEffect, useState } from "react";
import { MAINNET_ASSET_INDEX } from "../constants";
import { useGlobalState } from "../store/store";
import useAccountData from "./useAccountData";

export type Balances = {
  algo: number;
  ora?: number;
};

const useBalances = () => {
  const [balances, setBalances] = useState<Balances>();
  const minerWallet = useGlobalState((state) => state.minerWallet);
  const { data: accountData } = useAccountData(minerWallet?.addr.toString());

  useEffect(() => {
    if (!accountData) {
      setBalances(undefined);
    } else {
      const algo = Number(accountData.amount) / 1_000_000;

      const oraAsset = accountData.assets?.find(
        (asset) => asset.assetId == BigInt(MAINNET_ASSET_INDEX).valueOf()
      );

      const ora = oraAsset ? Number(oraAsset.amount) / 100_000_000 : undefined;

      setBalances({ algo, ora });
    }
  }, [accountData, setBalances]);

  return balances;
};
export default useBalances;
