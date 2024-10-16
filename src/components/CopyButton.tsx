import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button className="text-xs" onClick={onClick} title="Copy text">
      {copied ? <CopyCheck className="size-3" strokeWidth={2.5}/> : <Copy className="size-3" strokeWidth={2.5}/>}
    </button>
  );
};
export default CopyButton;