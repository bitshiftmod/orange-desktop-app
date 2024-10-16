import { useGlobalState } from "../../store/store";
import BaseModal from "./BaseModal";

const LogoutModal = ({ onClose }: { onClose: () => void }) => {
  const clearMinerWallet = useGlobalState((state) => state.clearMinerWallet);

  const logout = async () => {
    await clearMinerWallet();
    onClose();
  };

  return (
    <BaseModal>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">Logout</p>
        <p>Are you sure you want to logout?</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={logout}
            className="rounded w-full bg-orange-300 px-4 p-1"
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
