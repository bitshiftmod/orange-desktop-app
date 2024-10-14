import { generateAccount } from "algosdk";
import Row from "../components/Row";
import { useGlobalState } from "../store/store";
import { shortenAddress } from "../utils";

const Miner = () => {
  const minerWallet = useGlobalState((state) => state.minerWallet);
  const setMinerWallet = useGlobalState((state) => state.setMinerWallet);
  // const clearMinerWallet = useGlobalState((state) => state.clearMinerWallet);

  const createNewMinerWallet = async () => {
    const account = await generateAccount();
    setMinerWallet(account);
  };

  return (
    <div className="size-full flex flex-col p-6">
      <div className="flex items-center">
        <div className="flex justify-center w-full items-center font-bold text-lg gap-2">
          <img src="orange.svg" className="size-8" />
          Miner
        </div>
      </div>

      <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4">
        <div className="text-center font-bold w-full"> Wallet</div>
        {minerWallet ? (
          <div>
            <Row label="Address" value={shortenAddress(minerWallet.addr.toString())} />
          </div>
        ) : (
          <>
            <div>Create a Miner Wallet</div>
            <button
              className="bg-orange-500 text-white rounded px-4 py-1"
              onClick={createNewMinerWallet}
            >
              Generate
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Miner;
