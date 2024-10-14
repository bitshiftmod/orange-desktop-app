import { Link, useLocation } from "react-router-dom";

interface NavButtonProps {
  selectedIndex: number;
  index: number;
  text: string;
  target: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  selectedIndex,
  index,
  text,
  target,
}) => {
  return (
    <Link
      className={`flex items-center justify-center hover:text-white ${
        selectedIndex == index ? "text-white" : "text-gray-500"
      }`}
      to={target}
    >
      {text}
    </Link>
  );
};

const pathToIndexMap: { [key: string]: number } = {
  "/": 0,
  "/miner": 1,
  "/node": 2,
  "/settings": 2,
};

const BottomNav = () => {
  const location = useLocation();

  const selectedIndex = pathToIndexMap[location.pathname] || 0;

  return (
    <div className="grid grid-cols-4 h-12 text-xs bg-black text-white">
      <NavButton selectedIndex={selectedIndex} index={0} text="Home" target="/" />
      <NavButton selectedIndex={selectedIndex} index={1} text="Miner" target="/miner" />
      <NavButton selectedIndex={selectedIndex} index={2} text="Node" target="/node" />

      <NavButton selectedIndex={selectedIndex} index={3} text="Chart" target="/chart" />
    </div>
  );
};

export default BottomNav;
