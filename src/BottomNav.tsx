interface NavButtonProps {
  selectedIndex: number;
  index: number;
  text: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ selectedIndex, index, text, onClick }) => {
  return (
    <button
      className={`hover:text-white ${selectedIndex == index ? 'text-white' :'text-gray-500'}` }
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const BottomNav = () => {
  return (
    <div className="grid grid-cols-4 h-12 text-xs bg-black text-white">
      <NavButton
        selectedIndex={0}
        index={0}
        text="Home"
        onClick={() => {/* handle click */}}
      />

      <NavButton
        selectedIndex={0}
        index={1}
        text="Chart"
        onClick={() => {/* handle click */}}
      />
      <NavButton
        selectedIndex={0}
        index={2}
        text="Miner"
        onClick={() => {/* handle click */}}
      />
      <NavButton
        selectedIndex={0}
        index={3}
        text="Public"
        onClick={() => {/* handle click */}}
      />
    </div>
  );
};

export default BottomNav;
