import { generateAccount, mnemonicToSecretKey } from "algosdk";
import { useState } from "react";
import { useGlobalState } from "../../store/store";

const LoginPanel = () => {
  const setMinerWallet = useGlobalState((state) => state.setMinerWallet);

  const [seedPhrase, setSeedPhrase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createNewMinerWallet = async () => {
    const account = await generateAccount();
    setMinerWallet(account);
    setSeedPhrase("");
    setErrorMessage("");
  };

  const login = async (seedPhrase: string) => {
    try {
      const account = await mnemonicToSecretKey(seedPhrase);
      setMinerWallet(account);
      setSeedPhrase("");
    } catch (e) {
      setErrorMessage("Invalid Seed Phrase, please try again.");
    }
  };

  return (
    <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4 ">
      <div className="text-center font-bold w-full flex flex-col">Wallet</div>
      <div className="text-center">Enter Seed Phrase</div>
      <input
        className="bg-orange-100 w-full rounded border border-orange-200 focus:border-orange-500 focus:outline-none p-1"
        value={seedPhrase}
        onChange={(e) => {
          setSeedPhrase(e.target.value);
          setErrorMessage("");
        }}
      />
      <button
        className="bg-orange-500 text-white rounded px-4 py-1"
        onClick={() => login(seedPhrase)}
      >
        Login
      </button>

      {errorMessage && (
        <div className="text-red-500 text-center text-sm">{errorMessage}</div>
      )}

      <div className="flex items-center text-xs text-orange-400 gap-4 py-4">
        <hr className="border-orange-400 grow" />
        <div>or</div>
        <hr className="border-orange-400 grow" />
      </div>
      <button
        className="bg-orange-500 text-white rounded px-4 py-1"
        onClick={createNewMinerWallet}
      >
        Create New Wallet
      </button>
    </div>
  );
};

export default LoginPanel;