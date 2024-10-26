import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const TogglePassword = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        className="bg-orange-100 w-full rounded border border-orange-200 focus:border-orange-500 focus:outline-none p-1 pr-8"
        value={value}
        type={showPassword ? "text" : "password"}
        onChange={(e) => onChange(e)}
      />
      <button
        className="absolute right-0 h-full px-2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeIcon className="size-3" strokeWidth={2.5} />
        ) : (
          <EyeOffIcon className="size-3" strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
};
export default TogglePassword;
