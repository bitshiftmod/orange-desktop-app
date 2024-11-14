import { useQueryClient } from "react-query";
import Row from "../../components/Row";
import { MAINNET_ASSET_INDEX } from "../../constants";
import useBalances from "../../hooks/useBalances";
import { useGlobalState } from "../../store/store";
import { optIn } from "./mining";

const BalancesPanel = () => {
  const queryClient = useQueryClient();
  const algosdk = useGlobalState((state) => state.algosdk);
  const minerWallet = useGlobalState((state) => state.minerWallet);
  const balances = useBalances();

  const oraBalance = balances?.assets.find(
    (asset) => asset.assetInfo.id == MAINNET_ASSET_INDEX
  );

  return balances ? (
    <div className="rounded text-base mt-4 flex flex-col bg-orange-200 py-2 px-4 ">
      <div className="text-center font-bold w-full">Balances</div>
      <Row label="Algo" value={balances.algo.toFixed(4)} className="text-sm" />
      <Row
        label="ORA"
        value={
          oraBalance !== undefined ? (
            oraBalance.amount.toFixed(4)
          ) : (
            <button
              className="bg-orange-500 text-white rounded px-4 py-1 w-full"
              onClick={() => {
                if (algosdk && minerWallet) {
                  optIn(algosdk, minerWallet, false, true);
                  queryClient.invalidateQueries({
                    queryKey: ["accountData"],
                  });
                }
              }}
            >
              Opt In
            </button>
          )
        }
        className="text-sm"
      />
      {balances?.assets
        .filter((a) => a.assetInfo.id != MAINNET_ASSET_INDEX)
        .map((asset) => (
          <Row
            key={asset.assetInfo.id}
            label={asset.name}
            value={asset.amount.toFixed(4)}
            className="text-sm"
          />
        ))}
    </div>
  ) : (
    <></>
  );
};

export default BalancesPanel;
