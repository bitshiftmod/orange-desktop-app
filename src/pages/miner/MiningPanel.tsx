import { listen } from "@tauri-apps/api/event";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import RadioButton from "../../components/RadioButton";
import Row from "../../components/Row";
import { MAINNET_APP_INDEX } from "../../constants";
import useAccountData from "../../hooks/useAccountData";
import useAssetData, { readAssetData } from "../../hooks/useAssetData";
import useBalances from "../../hooks/useBalances";
import { addToLP, supportedLPTokens } from "../../lib/token";
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
  const minerUnlistenFn = useGlobalState((state) => state.minerUnlistenFn);
  const setMinerUnlistenFn = useGlobalState(
    (state) => state.setMinerUnlistenFn
  );

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

  useEffect(() => {
    if (assetData && minerWallet && assetData.block !== lastOraMinedRound) {
      setLastOraMinedRound(assetData.block);

      if (assetData.lastMiner === minerWallet.addr.toString()) {
        setOraMinedMessage(
          `You mined ${assetData.minerReward} ORA at Block ${assetData.block}`
        );
      } else {
        setOraMinedMessage(undefined);
      }
    }
  }, [assetData, lastOraMinedRound, minerWallet, minerConfig]);

  return (
    <div>
      <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4">
        {appOptedIn ? (
          minerUnlistenFn ? (
            <button
              className="bg-orange-500 text-white rounded px-4 py-1 w-full"
              onClick={async () => {
                if (minerUnlistenFn !== undefined) {
                  minerUnlistenFn();
                  setMinerUnlistenFn(undefined);
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
                  let lastOraMinedRound = 0;
                  const unlisten = await listen("timer-tick", async () => {
                    mine(algosdk, minerWallet);
                    const assetData = await readAssetData(
                      algosdk,
                      MAINNET_APP_INDEX
                    );
                    if (assetData.block !== lastOraMinedRound) {
                      lastOraMinedRound = assetData.block;
                      if (assetData.lastMiner === minerWallet.addr.toString()) {
                        const minerConfig =
                          useGlobalState.getState().minerConfig;
                        if (minerConfig.onMine == OnMineAction.ADD_TO_LP) {
                          addToLP(
                            algosdk,
                            minerWallet,
                            assetData.minerReward,
                            minerConfig.lpAssetId
                          );
                        }
                      }
                    }
                  });

                  setMinerUnlistenFn(unlisten);
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

  return (
    <div className="rounded text-base flex flex-col gap-2 bg-orange-200 p-2">
      <div className="text-center text-sm font-bold w-full">On Mine</div>

      <div className="flex flex-col text-sm p-2 gap-2">
        <RadioButton
          id="hodl"
          label="HODL"
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
        <div className="flex gap-2 items-center">
          <RadioButton
            id="addToLp"
            label="Add to LP"
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
          <div className="pr-4 flex w-fit items-center h-full relative">
            <select
              className="appearance-none rounded text-white bg-orange-500 pl-2 pr-6 py-1 focus:ring-0 focus:outline-none text-sm"
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
            <ChevronDown className="absolute right-5 size-4 top-[.375rem] text-white pointer-events-none" />
          </div>
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
