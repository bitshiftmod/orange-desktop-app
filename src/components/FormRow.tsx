import { ReactNode } from "react";

const FormRow = ({
  label,
  inputElement,
}: {
  label: string;
  inputElement: ReactNode;
}) => (
  <div className="flex gap-4">
    <div className="font-bold w-16">{label}</div>
    <div className="grow">{inputElement}</div>
  </div>
);

export default FormRow;
