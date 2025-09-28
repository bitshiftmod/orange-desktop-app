import { useQuery } from "react-query";

const ORA_ALGO_PRICE_URL = `https://api.vestigelabs.org/assets/price?asset_ids=1284444444&network_id=0&denominating_asset_id=0`;
const ORA_USDC_PRICE_URL = `https://api.vestigelabs.org/assets/price?asset_ids=1284444444&network_id=0&denominating_asset_id=31566704`;

/* 
[{"network_id":0,"asset_id":1284444444,"denominating_asset_id":31566704,"price":0.12683649532902588,"confidence":0.834016759544128,"total_lockup":706674.14434266}]
*/
type PriceData = {
  network_id: number;
  asset_id: number;
  denominating_asset_id: number;
  price: number;
  confidence: number;
  total_lockup: number;
};

const usePriceData = () => {
  const res = useQuery(
    "priceData",
    async () => {
      const usdcPrice = await fetch(ORA_USDC_PRICE_URL);
      const priceData = await usdcPrice.json();

      const algoPrice = await fetch(ORA_ALGO_PRICE_URL);
      const algoPriceData = await algoPrice.json();

      return {
        algoPriceData: algoPriceData[0] as PriceData,
        usdcPriceData: priceData[0] as PriceData,
      };
    },
    {
      refetchInterval: 15000,
    }
  );

  return res;
};

export default usePriceData;
