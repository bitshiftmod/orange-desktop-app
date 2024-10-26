import { useGlobalState } from "../../store/store";
import BaseModal from "./BaseModal";

const LogoutModal = ({ onClose }: { onClose: () => void }) => {
  const clearMinerWallet = useGlobalState((state) => state.clearMinerWallet);
  const store = useGlobalState((state) => state.store);

  const logout = async () => {
    await clearMinerWallet();
    await store?.delete("savedAccount");
    await store?.save();
    onClose();
  };

  return (
    <BaseModal>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">Logout</p>
        <p>Are you sure you want to logout?</p>
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={logout}
            className="rounded w-full bg-orange-500 px-4 p-1 text-white"
          >
            Confirm
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

export default LogoutModal;
