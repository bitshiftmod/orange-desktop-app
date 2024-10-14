import algosdk from "algosdk";

const COMMA_NUMBER_FORMAT = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export const formatWithCommas = (num: number): string => {
  return COMMA_NUMBER_FORMAT.format(num);
};

export const keyToValue = (state: any, key: string): number => {
  const bKey = btoa(key);
  const kv = state.find((k: any) => k["key"] === bKey);
  if (kv) {
    return kv.value.uint;
  }
  return 0;
};

export const keyToAddress = (state: any, key: string): string => {
  const bKey = btoa(key);
  const kv = state.find((k: any) => k["key"] === bKey);
  if (kv) {
    // @ts-ignore
    return algosdk.encodeAddress(Buffer.from(kv.value.bytes, "base64"));
  }
  return "";
};

export const keyToBigint = (state: any, key: string): bigint => {
  const bKey = btoa(key);
  const kv = state.find((k: any) => k["key"] === bKey);
  if (kv) {
    // @ts-ignore
    return algosdk.bytesToBigInt(Buffer.from(kv.value.bytes, "base64"));
  }
  return BigInt(0);
};

export const shortenAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-6);
}