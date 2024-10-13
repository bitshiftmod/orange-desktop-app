import { ReactNode } from "react";
import useAssetData from "../hooks/useAssetData";
import { formatWithCommas } from "../utils";
import usePriceData from "../hooks/usePriceData";

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between">
    <div className="font-bold">{label}</div>
    <div>{value}</div>
  </div>
);

const Home = () => {
  const { data: assetData } = useAssetData();

  const { data: priceData } = usePriceData();

  return (
    <div className="size-full flex flex-col p-6">
      <div className="h-full grow">
        <img src="orange.svg" className="size-8 justify-center w-full" />

        <div className="rounded text-base mt-4 grid grid-cols-2 gap-2 bg-orange-200 p-4">
          {priceData ? (
            <>
              <div className="flex justify-center gap-1">
                <span className="font-bold">Algo:</span>{" "}
                {priceData.price.toFixed(4)}
              </div>
              <div className="flex justify-center gap-1">
                <span className="font-bold">USD:</span>{" "}
                {priceData.USD.toFixed(4)}
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>

        {assetData ? (
          <div className="text-md mt-4 flex flex-col gap-4">
            <div className="rounded">
              <div className="bg-orange-950 h-2 w-full justify-start flex rounded-t overflow-clip">
                <div
                  className="bg-gradient-to-l from-orange-300 to-orange-500 h-2"
                  style={{ width: `${assetData.halvingProgress.toFixed(0)}%` }}
                ></div>
              </div>
              <div className="bg-orange-200 p-4">
                <Row
                  label="Halving Progress:"
                  value={assetData.halvingProgress.toFixed(2) + "%"}
                />
                <Row
                  label="Days to Halving:"
                  value={assetData.daysToHalving.toFixed(2)}
                />
              </div>
            </div>

            <div className="rounded bg-orange-200 p-4">
              <Row
                label="Block:"
                value={formatWithCommas(Number(assetData.block))}
              />
              <Row
                label="Total Algo Effort:"
                value={formatWithCommas(
                  Math.floor(Number(assetData.totalEffort) / 1_000_000)
                )}
              />
              <Row
                label="Juicing Transactions:"
                value={formatWithCommas(Number(assetData.totalTransactions))}
              />
            </div>
            {/* <Row label="Recent Algo Effort:" value={Number(assetData.)} /> */}
            {/* {Object.entries(assetData).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <div>{key}</div>
                <div>{value.toString()}</div>
              </div>
            ))} */}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};
export default Home;
