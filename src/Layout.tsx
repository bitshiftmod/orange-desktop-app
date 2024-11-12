import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

const Layout = () => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <div className="grow overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
