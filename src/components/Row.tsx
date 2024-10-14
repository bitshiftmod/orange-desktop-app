import { ReactNode } from "react";

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex justify-between">
      <div className="font-bold">{label}</div>
      <div>{value}</div>
    </div>
  );
  
export default Row;