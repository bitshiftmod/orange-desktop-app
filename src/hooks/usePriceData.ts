import { useQuery } from "react-query";
import { MAINNET_ASSET_INDEX } from "../constants";

const REQUEST_URL = `https://free-api.vestige.fi/asset/${MAINNET_ASSET_INDEX}/price`;

/* 
{
  "USD": 0.0711467242479395,
  "EUR": 0.06501338595070333,
  "GBP": 0.05432385348980602,
  "BTC": 0.000001127365991777695,
  "timestamp": 1728778310,
  "price": 0.5841274568796346
}
*/
type PriceData = {
  USD: number;
  EUR: number;
  GBP: number;
  BTC: number;
  timestamp: number;
  price: number;
}

const usePriceData = () => {
  const res = useQuery(
    "priceData",
    () => fetch(REQUEST_URL).then((res) => res.json() as Promise<PriceData>),
    {
      refetchInterval: 5000,
    }
  );

  return res;
};

export default usePriceData;
