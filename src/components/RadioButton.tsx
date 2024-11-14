interface RadioButtonProps {
  id: string;
  name: string;
  label: string;
  value: string | readonly string[] | number | undefined;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton = ({
  id,
  name,
  label,
  value,
  checked,
  onChange,
}: RadioButtonProps) => {
  return (
    <div className="relative flex items-center gap-2 ">
      <div className="grid place-items-center mt-1">
        <input
          className="appearance-none col-start-1 row-start-1 rounded-full size-4 border-2 border-orange-500 peer  cursor-pointer"
          type="radio"
          name={name}
          id={id}
          checked={checked}
          value={value}
          onChange={onChange}
        />
        <span className="peer-checked:opacity-100 col-start-1 row-start-1 opacity-0 size-2 rounded-full bg-orange-500 pointer-events-none" />
      </div>
      <label className="cursor-pointer" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
