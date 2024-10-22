import Row from "../../components/Row";
import useBalances from "../../hooks/useBalances";
import { useGlobalState } from "../../store/store";
import Header from "./Header";
import LoginPanel from "./LoginPanel";
import MiningPanel from "./MiningPanel";

const Miner = () => {
  const balances = useBalances();
  const minerWallet = useGlobalState((state) => state.minerWallet);

  return (
    <div className="size-full flex flex-col p-6">
      <Header />
      {balances && (
        <div className="rounded text-base mt-4 flex flex-col bg-orange-200 p-4 ">
          <div className="text-center font-bold w-full">
            Balances
          </div>
          <Row label="Algo" value={balances.algo.toFixed(4)} className="text-sm"/>
          <Row label="ORA" value={balances.ora.toFixed(4)} className="text-sm"/>
        </div>
      )}
      {!minerWallet ? <LoginPanel /> : <MiningPanel />}
    </div>
  );
};
export default Miner;
