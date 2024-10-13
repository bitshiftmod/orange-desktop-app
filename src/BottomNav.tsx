import { Link } from "react-router-dom";

interface NavButtonProps {
  selectedIndex: number;
  index: number;
  text: string;
  target: string;
}

const NavButton: React.FC<NavButtonProps> = ({ selectedIndex, index, text, target }) => {
  return (
    <Link
      className={`flex items-center justify-center hover:text-white ${selectedIndex == index ? 'text-white' :'text-gray-500'}` }
      to={target}
    >
      {text}
    </Link>
  );
};

const BottomNav = () => {
  return (
    <div className="grid grid-cols-4 h-12 text-xs bg-black text-white">
      <NavButton
        selectedIndex={0}
        index={0}
        text="Home"
        target="/" 
      />

      <NavButton
        selectedIndex={0}
        index={1}
        text="Chart"
        target="/chart"
      />
      <NavButton
        selectedIndex={0}
        index={2}
        text="Miner"
        target="/miner"
      />
      <NavButton
        selectedIndex={0}
        index={3}
        text="Settings"
        target="/settings"
      />
    </div>
  );
};

export default BottomNav;
