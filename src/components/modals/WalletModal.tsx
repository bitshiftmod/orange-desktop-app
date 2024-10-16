import algosdk, { Account } from "algosdk";
import { useState } from "react";
import QRCode from "react-qr-code";
import { shortenAddress } from "../../utils";
import CopyButton from "../CopyButton";
import BaseModal from "./BaseModal";
import LogoutModal from "./LogoutModal";

const WalletModal = ({
  minerWallet,
  onClose,
}: {
  minerWallet: Account;
  onClose: () => void;
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const copySeedPhrase = () => {
    if (!minerWallet) {
      return;
    }
    navigator.clipboard.writeText(algosdk.secretKeyToMnemonic(minerWallet.sk));
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="flex flex-col w-60">
        <div className="flex justify-center">
          <QRCode className="size-24" value={minerWallet.addr.toString()} />
        </div>
        <div className="flex gap-1 py-4 justify-center">
          <div>{shortenAddress(minerWallet.addr.toString())}</div>
          <CopyButton text={minerWallet.addr.toString()} />
        </div>
        <div className="flex justify-center">
          <button
            className="bg-orange-100 text-black rounded text-xs px-2 py-1"
            onClick={copySeedPhrase}
          >
            Copy Seed Phrase
          </button>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-orange-500 text-white rounded px-4 py-1"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>

        {showLogoutModal && (
          <LogoutModal
            onClose={() => {
              setShowLogoutModal(false);
              onClose();
            }}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default WalletModal;
