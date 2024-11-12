import { Address } from "algosdk";
import { useQuery } from "react-query";
import { useGlobalState } from "../store/store";

const useAccountData = (account?: string | Address) => {
  const algosdk = useGlobalState((state) => state.algosdk);

  const res = useQuery(
    ["accountData", algosdk, account],
    () => {
      if (!algosdk || !account) {
        throw new Error("algosdk or account is not set");
      }
      return algosdk.accountInformation(account.toString()).do();
    },
    {
      refetchInterval: 1000,
    }
  );

  return res;
};

export default useAccountData;
