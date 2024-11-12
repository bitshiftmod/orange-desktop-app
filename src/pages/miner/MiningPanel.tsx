import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Row from "../../components/Row";
import { MAINNET_APP_INDEX } from "../../constants";
import useAccountData from "../../hooks/useAccountData";
import useAssetData from "../../hooks/useAssetData";
import useBalances from "../../hooks/useBalances";
import { supportedLPTokens } from "../../lib/token";
import { OnMineAction, useGlobalState } from "../../store/store";
import SliderPanel from "./SliderPanel";
import { mine, optIn } from "./mining";

// encoded value for key "effort"
const effortKey = "ZWZmb3J0";

const MiningSettingsPanel = () => {
  const queryClient = useQueryClient();

  const [appOptedIn, setAppOptedIn] = useState(false);
  const [effort, setEffort] = useState(0);
  const [lastOraMinedRound, setLastOraMinedRound] = useState(0);
  const [oraMinedMessage, setOraMinedMessage] = useState<string>();

  const balances = useBalances();
  const minerWallet = useGlobalState((state) => state.minerWallet);
  const algosdk = useGlobalState((state) => state.algosdk);
  const minerConfig = useGlobalState((state) => state.minerConfig);
  const updateMinerConfig = useGlobalState((state) => state.updateMinerConfig);
  const minerInterval = useGlobalState((state) => state.minerInterval);
  const setMinerInterval = useGlobalState((state) => state.setMinerInterval);

  const { data: assetData } = useAssetData();
  const { data: accountData } = useAccountData(minerWallet?.addr.toString());

  const cost = ((minerConfig.tpm / 60) * minerConfig.fpt) / 1_000_000;
  const miningSecondsLeft = (balances?.algo ?? 0) / cost;
  const miningHours = Math.floor(miningSecondsLeft / 3600);
  const miningMinutes = Math.floor((miningSecondsLeft % 3600) / 60);

  useEffect(() => {
    if (accountData) {
      const app = accountData["apps-local-state"].find(
        (a: any) => a["id"] === MAINNET_APP_INDEX
      );
      setAppOptedIn(!!app);
      const kv = app
        ? app["key-value"].find((kv: any) => kv.key == effortKey)
        : undefined;
      setEffort(kv ? Number(kv.value.uint) : 0);
    }
  }, [accountData]);

  // useEffect(() => {
  //   if (assetData && minerWallet && assetData.block !== lastOraMinedRound) {
  //     setLastOraMinedRound(assetData.block);

  //     if (assetData.lastMiner === minerWallet.addr.toString()) {
  //       setOraMinedMessage(
  //         `You mined ${assetData.minerReward} ORA at Block ${assetData.block}`
  //       );

  //       if (minerConfig.onMine == OnMineAction.ADD_TO_LP) {
  //         if (algosdk && minerWallet && assetData?.minerReward) {
  //           addToLP(
  //             algosdk,
  //             minerWallet,
  //             assetData.minerReward,
  //             minerConfig.lpAssetId
  //           );
  //         }
  //       }
  //     } else {
  //       setOraMinedMessage(undefined);
  //     }
  //   }
  // }, [assetData, lastOraMinedRound, minerWallet, minerConfig]);

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
        {oraMinedMessage && (
          <div className="text-sm text-center text-red-500">
            {oraMinedMessage}
          </div>
        )}
      </div>
      <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4">
        {/* <div className="text-center font-bold w-full flex flex-col">
          Settings
        </div> */}
        <SliderPanel
          label="Transactions Per Minute"
          value={minerConfig.tpm}
          setValue={(v) => {
            updateMinerConfig({ ...minerConfig, tpm: v });
          }}
          min={6}
          max={7680}
          ticker={`${minerConfig.tpm} TPM (${+(minerConfig.tpm / 60).toFixed(
            2
          )} TPS)`}
          step={1}
        />
        <SliderPanel
          label="Fee per transaction"
          min={2000}
          max={20000}
          step={500}
          value={minerConfig.fpt}
          ticker={`${+(minerConfig.fpt / 1_000_000).toFixed(4)} ALGO`}
          setValue={(v) => {
            updateMinerConfig({ ...minerConfig, fpt: v });
          }}
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

const OnMinePanel = () => {
  const minerConfig = useGlobalState((state) => state.minerConfig);
  const updateMinerConfig = useGlobalState((state) => state.updateMinerConfig);

  const { data: assetData } = useAssetData();
  const minerWallet = useGlobalState((state) => state.minerWallet);
  const algosdk = useGlobalState((state) => state.algosdk);

  return (
    <div className="rounded text-base flex flex-col gap-2 bg-orange-200 p-2">
      <div className="text-center text-sm font-bold w-full">On Mine</div>

      <div className="flex flex-col text-sm p-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="onMine"
            checked={minerConfig.onMine == OnMineAction.HODL}
            value={OnMineAction.HODL}
            onChange={() => {
              updateMinerConfig({
                ...minerConfig,
                onMine: OnMineAction.HODL,
              });
            }}
          />
          <label>HODL</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="onMine"
            checked={minerConfig.onMine == OnMineAction.ADD_TO_LP}
            value={OnMineAction.ADD_TO_LP}
            onChange={() => {
              updateMinerConfig({
                ...minerConfig,
                onMine: OnMineAction.ADD_TO_LP,
              });
            }}
          />
          <label>Add to LP</label>
        </div>
        <div className="pt-2 px-4">
          <select
            value={minerConfig.lpAssetId}
            onChange={(e) => {
              updateMinerConfig({
                ...minerConfig,
                lpAssetId: Number(e.target.value),
              });
            }}
          >
            {supportedLPTokens.map((token) => (
              <option key={token.id} value={token.id}>
                {token.name}
              </option>
            ))}
          </select>
        </div>
        {/* <button
          className="bg-orange-500 text-white rounded px-4 py-1 w-full"
          onClick={() => {
            if (algosdk && minerWallet && assetData?.minerReward) {
              addToLP(
                algosdk,
                minerWallet,
                assetData.minerReward,
                minerConfig.lpAssetId
              );
            }
          }}
        >
          Test
        </button> */}
      </div>
    </div>
  );
};

const MiningPanel = () => {
  return (
    <div className="flex flex-col gap-4">
      <MiningSettingsPanel />
      <OnMinePanel />
    </div>
  );
};

export default MiningPanel;
