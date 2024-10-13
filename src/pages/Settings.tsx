const Settings = () => {
  return (
    <div className="size-full flex flex-col">
      <div className="h-full grow">
        {/* <img src="orange.svg" className="size-8"/>
      <div className="text-orange-800 w-full text-center text-2xl font-bold">Orange</div> */}

        {/* <Chart assetId={1284444444} width={400} height={500}/> */}
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
export default Settings;