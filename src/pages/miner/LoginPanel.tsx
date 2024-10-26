import { Account, generateAccount, mnemonicToSecretKey } from "algosdk";
import { useState } from "react";
import { decryptAccount, verifyPassword } from "../../account";
import CreatePasswordModal from "../../components/modals/CreatePasswordModal";
import TogglePassword from "../../components/TogglePassword";
import { useGlobalState } from "../../store/store";

const LoginPanel = () => {
  const [password, setPassword] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localWallet, setLocalWallet] = useState<Account>();

  const store = useGlobalState((state) => state.store);
  const setMinerWallet = useGlobalState((state) => state.setMinerWallet);
  const clearMinerWallet = useGlobalState((state) => state.clearMinerWallet);

  const savedAccount = useGlobalState((state) => state.savedAccount);

  const createNewWallet = async () => {
    const account = await generateAccount();
    setLocalWallet(account);
  };

  const importWallet = async (seedPhrase: string) => {
    try {
      const account = await mnemonicToSecretKey(seedPhrase);

      setLocalWallet(account);
    } catch (e) {
      setErrorMessage("Invalid Seed Phrase, please try again.");
    }
  };

  const login = async (password: string) => {
    if (savedAccount) {
      const valid = await verifyPassword(savedAccount.passwordHash, password);
      if (valid) {
        const account = decryptAccount(
          savedAccount.encryptedAccountData,
          password
        );
        setMinerWallet(account);
      } else {
        setErrorMessage("Invalid Password, please try again.");
      }
    }
  };

  const forgetWallet = async () => {
    await clearMinerWallet();
    await store?.delete("savedAccount");
    await store?.save();
  };

  return savedAccount ? (
    <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4 ">
      <div className="text-center font-bold w-full flex flex-col">
        Enter Password
      </div>
      <TogglePassword
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage("");
        }}
      />
      <button
        className="bg-orange-500 text-white rounded px-4 py-1"
        onClick={() => login(password)}
        disabled={password.length < 3}
      >
        Login
      </button>
      <button
        className=" text-orange-500 px-4 py-1 text-xs"
        onClick={() => forgetWallet()}
      >
        Forget Wallet 
      </button>

      {errorMessage && (
        <div className="text-red-500 text-center text-sm">{errorMessage}</div>
      )}
    </div>
  ) : (
    <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4 ">
      <div className="text-center font-bold w-full flex flex-col">Wallet</div>
      <div className="text-center">Enter Seed Phrase</div>
      <TogglePassword
        value={seedPhrase}
        onChange={(e) => {
          setSeedPhrase(e.target.value);
          setErrorMessage("");
        }}
      />
      <button
        className="bg-orange-500 text-white rounded px-4 py-1"
        onClick={() => importWallet(seedPhrase)}
      >
        Import Wallet
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
        onClick={createNewWallet}
      >
        Create New Wallet
      </button>
      {localWallet && (
        <CreatePasswordModal
          account={localWallet}
          onClose={() => {
            setLocalWallet(undefined);
          }}
        />
      )}
    </div>
  );
};

export default LoginPanel;
