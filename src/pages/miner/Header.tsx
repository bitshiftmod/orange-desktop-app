import { WalletIcon } from "lucide-react";
import { useState } from "react";
import WalletModal from "../../components/modals/WalletModal";
import { useGlobalState } from "../../store/store";

const Header = () => {
  const minerWallet = useGlobalState((state) => state.minerWallet);

  const [showWalletModal, setShowWalletModal] = useState(false);
  return (
    <div className="flex items-center">
      <div className="w-5" />
      <div className="flex justify-center w-full items-center font-bold text-lg gap-2">
        <img src="orange.svg" className="size-8" />
        Miner
      </div>
      <div className="w-5">
        {minerWallet && (
          <WalletIcon
            className="cursor-pointer size-5"
            onClick={() => setShowWalletModal(true)}
          />
        )}
      </div>

      {showWalletModal && minerWallet && (
        <WalletModal
          minerWallet={minerWallet}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  );
};
export default Header;