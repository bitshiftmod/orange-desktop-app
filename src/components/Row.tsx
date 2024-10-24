import { HTMLAttributes, ReactNode } from "react";

interface RowProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
}

const Row = ({ label, value, className, ...rest }: RowProps) => {
  return (
  <div className={`flex justify-between items-center ${className}`} {...rest}>
    <div className="font-bold">{label}</div>
    <div>{value}</div>
  </div>
)};
  
export default Row;