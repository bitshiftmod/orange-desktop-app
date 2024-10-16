const COMMA_NUMBER_FORMAT = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export const formatWithCommas = (num: number): string => {
  return COMMA_NUMBER_FORMAT.format(num);
};

export const shortenAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-6);
};

export const encrypt = async (
  data: string,
  password: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  const passwordEncoded = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", passwordEncoded);

  // Import the key
  const key = await crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  const encryptedArray = new Uint8Array(encrypted);
  const ivArray = new Uint8Array(iv);
  const encryptedString = `${btoa(
    String.fromCharCode(...encryptedArray)
  )}.${btoa(String.fromCharCode(...ivArray))}`;
  return encryptedString;
};

export const decrypt = async (
  encryptedString: string,
  password: string
): Promise<string> => {
  const [encrypted, iv] = encryptedString.split(".");
  const encryptedArray = new Uint8Array(
    atob(encrypted)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const ivArray = new Uint8Array(
    atob(iv)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const passwordEncoded = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", passwordEncoded);

  // Import the key
  const key = await crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    key,
    encryptedArray
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
