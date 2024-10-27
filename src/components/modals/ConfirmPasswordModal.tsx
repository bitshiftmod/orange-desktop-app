import { useEffect, useState } from "react";
import { SavedAccount, verifyPassword } from "../../account";
import { useGlobalState } from "../../store/store";
import TogglePassword from "../TogglePassword";
import BaseModal from "./BaseModal";

const ConfirmPasswordModal = ({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const store = useGlobalState((state) => state.store);

  useEffect(() => {
    const validationError =
      password.length < 3
        ? "Password must be at least 3 characters"
        : undefined;
    setErrorMessage(validationError);
  }, [password]);

  const checkPassword = async () => {
    if (store) {
      const savedAccount = await store.get<SavedAccount>("savedAccount");

      if (savedAccount) {
        const res = await verifyPassword(savedAccount?.passwordHash, password);
        if (res) {
          onSuccess();
          onClose();
        } else {
          setErrorMessage("Invalid Password, please try again.");
        }
      } else {
      }
    }
  };

  return (
    <BaseModal>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">Secure Operation</p>
        <p>Enter Password</p>
        <TogglePassword
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {errorMessage && (
          <div className="text-red-500 text-center text-xs w-full">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col gap-2 mt-4">
          <button
          disabled={password.length < 3}
            onClick={checkPassword}
            className="rounded w-full bg-orange-500 disabled:bg-orange-500/50 px-4 p-1 text-white"
          >
            Verify
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

export default ConfirmPasswordModal;
