import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Row from "../../components/Row";
import { MAINNET_APP_INDEX } from "../../constants";
import useAccountData from "../../hooks/useAccountData";
import useBalances from "../../hooks/useBalances";
import { useGlobalState } from "../../store/store";
import SliderPanel from "./SliderPanel";
import { mine, optIn } from "./mining";

const effortKey = new Uint8Array(new TextEncoder().encode("effort").buffer);

const MiningSettingsPanel = () => {
  const queryClient = useQueryClient();

  const [appOptedIn, setAppOptedIn] = useState(false);
  const [effort, setEffort] = useState(0);

  const balances = useBalances();
  const minerWallet = useGlobalState((state) => state.minerWallet);
  const algosdk = useGlobalState((state) => state.algosdk);
  const tpm = useGlobalState((state) => state.tpm);
  const fpt = useGlobalState((state) => state.fpt);
  const minerInterval = useGlobalState((state) => state.minerInterval);
  const setTpm = useGlobalState((state) => state.setTpm);
  const setFpt = useGlobalState((state) => state.setFpt);
  const setMinerInterval = useGlobalState((state) => state.setMinerInterval);

  // const { data: assetData } = useAssetData();
  const { data: accountData } = useAccountData(minerWallet?.addr.toString());

  const cost = ((tpm / 60) * fpt) / 1_000_000;
  const miningSecondsLeft = (balances?.algo ?? 0) / cost;
  const miningHours = Math.floor(miningSecondsLeft / 3600);
  const miningMinutes = Math.floor((miningSecondsLeft % 3600) / 60);

  useEffect(() => {
    if (accountData) {
      const app = accountData.appsLocalState?.find(
        (app) => app.id === BigInt(MAINNET_APP_INDEX).valueOf()
      );
      setAppOptedIn(!!app);
      const kv = app
        ? app.keyValue?.find((kv) => kv.key.toString() == effortKey.toString())
        : undefined;
      setEffort(kv ? Number(kv.value.uint) : 0);
    }
  }, [accountData]);

  return (
    <div>
      <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4">
        {appOptedIn ? (
          minerInterval ? (
            <button
              className="bg-orange-500 text-white rounded px-4 py-1 w-full"
              onClick={async () => {
                if (minerInterval) {
                  clearInterval(minerInterval);
                  setMinerInterval(undefined);
                }
              }}
            >
              Stop Mining
            </button>
          ) : (
            <button
              className="bg-orange-500 text-white rounded px-4 py-1 w-full"
              onClick={async () => {
                if (algosdk && minerWallet) {
                  const interval = setInterval(() => {
                    mine(algosdk, minerWallet);
                  }, 1000);
                  setMinerInterval(interval);
                }
              }}
            >
              Start Mining
            </button>
          )
        ) : (
          <button
            className="bg-orange-500 text-white rounded px-4 py-1 w-full"
            onClick={async () => {
              if (algosdk && minerWallet) {
                await optIn(algosdk, minerWallet, true, false);
                queryClient.invalidateQueries({ queryKey: "accountData" });
              }
            }}
          >
            Opt Into App
          </button>
        )}
      </div>
      <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4">
        {/* <div className="text-center font-bold w-full flex flex-col">
          Settings
        </div> */}
        <SliderPanel
          label="Transactions Per Minute"
          value={tpm}
          setValue={setTpm}
          min={6}
          max={7680}
          ticker={`${tpm} TPM (${+(tpm / 60).toFixed(2)} TPS)`}
          step={1}
        />
        <SliderPanel
          label="Fee per transaction"
          min={2000}
          max={20000}
          step={500}
          value={fpt}
          ticker={`${+(fpt / 1_000_000).toFixed(4)} ALGO`}
          setValue={setFpt}
        />
        <Row
          className="text-sm"
          label="Cost per minute"
          value={`${+(cost * 60).toFixed(4)} ALGO`}
        />
        <Row
          className="text-sm"
          label="Juicing Time Left"
          value={`${miningHours}H ${miningMinutes}M ${(
            miningSecondsLeft % 60
          ).toFixed(2)}S`}
        />
        <Row
          className="text-sm"
          label="Current Effort"
          value={`${(effort / 1_000_000).toFixed(3)} A`}
        />
      </div>
    </div>
  );
};

const MiningPanel = () => {
  return (
    <div>
      <MiningSettingsPanel />
    </div>
  );
};

export default MiningPanel;
