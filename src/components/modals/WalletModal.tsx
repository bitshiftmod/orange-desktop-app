import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import algosdk, { Account } from "algosdk";
import { useState } from "react";
import QRCode from "react-qr-code";
import { shortenAddress } from "../../lib/utils";
import CopyButton from "../CopyButton";
import BaseModal from "./BaseModal";
import ConfirmPasswordModal from "./ConfirmPasswordModal";
import LogoutModal from "./LogoutModal";

const WalletModal = ({
  minerWallet,
  onClose,
}: {
  minerWallet: Account;
  onClose: () => void;
}) => {
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] =
    useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const copySeedPhrase = () => {
    if (!minerWallet) {
      return;
    }
    writeText(algosdk.secretKeyToMnemonic(minerWallet.sk));
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
        <div className="flex flex-col justify-center rounded bg-orange-300 p-4 gap-2">
          <button
            className="bg-orange-500 text-white rounded text-xs px-2 py-1"
            // onClick={() => setShowConfirmPasswordModal(true)}
            onClick={() => setShowConfirmPasswordModal(true)}
          >
            Copy Seed Phrase
          </button>
          <p className='text-xs text-red-500'>Warning: Keep this secure and do not share with anyone.</p>
          <p className='text-xs text-orange-800'>Requires password to proceed.</p>
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
              // onClose();
            }}
          />
        )}
        {showConfirmPasswordModal && (
          <ConfirmPasswordModal
            onSuccess={copySeedPhrase}
            onClose={() => setShowConfirmPasswordModal(false)}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default WalletModal;
