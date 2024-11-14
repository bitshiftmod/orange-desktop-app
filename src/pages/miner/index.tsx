import { useGlobalState } from "../../store/store";
import BalancesPanel from "./BalancesPanel";
import Header from "./Header";
import LoginPanel from "./LoginPanel";
import MiningPanel from "./MiningPanel";

const Miner = () => {
  const minerWallet = useGlobalState((state) => state.minerWallet);

  return (
    <div className="size-full flex max-h-full flex-col ">
      <Header/>
      <div className="overflow-y-auto pb-6 px-6">
        <BalancesPanel />
        {!minerWallet ? <LoginPanel /> : <MiningPanel />}
      </div>
    </div>
  );
};
export default Miner;
