import { Address } from "algosdk";
import { useQuery } from "react-query";
import { useGlobalState } from "../store/store";

const useAccountData = (account?: string | Address) => {
  const algosdk = useGlobalState((state) => state.algosdk);

  const res = useQuery(
    ["assetData", algosdk, account],
    () => {
      if (!algosdk || !account) {
        throw new Error("algosdk or account is not set");
      }
      return algosdk.accountInformation(account).do();
    },
    {
      refetchInterval: 3000,
    }
  );

  return res;
};

export default useAccountData;
