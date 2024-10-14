const Miner = () => {
  return (
    <div className="size-full flex flex-col">
      <div className="h-full grow">
        <iframe
          title="Vestige Widget"
          src="https://vestige.fi/widget/1284444444/chart"
          // src="https://vestige.fi/asset/1284444444"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
export default Miner;