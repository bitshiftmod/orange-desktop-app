import { Account } from "algosdk";
import { useEffect, useState } from "react";
import { createPasswordHash, encryptAccount, SavedAccount } from "../../account";
import { useGlobalState } from "../../store/store";
import TogglePassword from "../TogglePassword";
import BaseModal from "./BaseModal";

const CreatePasswordModal = ({
  account,
  onClose,
}: {
  account: Account;
  onClose: () => void;
}) => {

  const setMinerWallet = useGlobalState((state) => state.setMinerWallet);
  const store = useGlobalState((state) => state.store);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string>();

  useEffect(() => {
    const validationError =
      !password && !confirmPassword
        ? undefined
        : password.length < 3
        ? "Password must be at least 3 characters"
        : password !== confirmPassword
        ? "Passwords do not match"
        : undefined;
    setValidationError(validationError);
  }, [password, confirmPassword]);

  const isValid = password === confirmPassword && password.length >= 3;

  const setWalletPassword = async () => {
    if(store) {
      const passwordHash = createPasswordHash(password);
      const encryptedAccountData = encryptAccount(account, password);

      const savedAccount:SavedAccount = {
        address: account.addr.toString(),
        encryptedAccountData,
        passwordHash
      }

      await store.set("savedAccount", savedAccount);
      await store.save();
      setMinerWallet(account);
    }

    onClose();
  };

  return (
    <BaseModal>
      <div className="flex flex-col gap-2 w-full px-6 text-sm">
        <p className="font-bold text-base">Secure Your Wallet</p>
        <p>Enter Password</p>
        <TogglePassword
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <p>Confirm Password</p>
        <TogglePassword
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
        {validationError && (
          <div className="text-red-500 text-center text-xs w-full">
            {validationError}
          </div>
        )}
        <div className="flex flex-col gap-2  mt-4">
          <button
            onClick={setWalletPassword}
            className="rounded w-full bg-orange-500 px-4 p-1 text-white disabled:bg-orange-500/50"
            disabled={!isValid}
          >
            Set Password
          </button>
          <button
            onClick={onClose}
            className="rounded w-full bg-orange-100 px-4 p-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreatePasswordModal;
