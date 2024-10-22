import { useState } from "react";
import Row from "../../components/Row";
import useBalances from "../../hooks/useBalances";
import SliderPanel from "./SliderPanel";

const MiningSettingsPanel = () => {
  const [tpm, setTpm] = useState(60);
  const [fpt, setFpt] = useState(2000);

  const balances = useBalances();

  const cost = ((tpm / 60) * fpt) / 1_000_000;
  const miningSecondsLeft = (balances?.algo ?? 0) / cost;
  const miningHours = Math.floor(miningSecondsLeft / 3600);
  const miningMinutes = Math.floor((miningSecondsLeft % 3600) / 60);

  return (
    <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4">
      <div className="text-center font-bold w-full flex flex-col">Settings</div>
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
        value={`${miningHours}H ${miningMinutes}M ${(miningSecondsLeft % 60).toFixed(
          2
        )}S`}
      />

      <button className="bg-orange-500 text-white rounded px-4 py-1 w-full">
        Start Mining
      </button>
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
