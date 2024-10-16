import { Dialog, DialogPanel } from "@headlessui/react";
import { ReactElement } from "react";

const BaseModal = ({
  children,
  onClose = () => {},
}: {
  children: ReactElement;
  onClose?: () => void;
}) => {
  return (
    <Dialog open={true} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 w-screen bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={`relative flex max-h-full flex-col items-stretch rounded text-center text-grey-100`}
        >
          <div className="flex grow flex-col overflow-y-auto scrollbar rounded bg-orange-200 p-6">
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default BaseModal;
