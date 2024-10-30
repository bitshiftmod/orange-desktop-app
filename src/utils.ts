const COMMA_NUMBER_FORMAT = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export const formatWithCommas = (num: number): string => {
  return COMMA_NUMBER_FORMAT.format(num);
};

export const shortenAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-6);
};

const blacklist = [
  "https://mainnet-idx.4160.nodely.dev",
  "https://mainnet-api.4160.nodely.dev",
  "https://mainnet-api.algonode.cloud",
  "https://mainnet-idx.algonode.cloud"
];

export const isOnBlacklist = (url:string) => {
  return blacklist.includes(url);
}
