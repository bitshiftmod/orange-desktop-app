// based on code from @tamequest/account : https://github.com/TameQuest/Account/blob/main/src/index.ts
import algosdk, { Account } from "algosdk";
import CryptoJS from "crypto-js";

export interface PasswordHash {
  hash: string;
  salt: string;
  iterations: number;
}

export interface EncryptedAccountData {
  salt: string;
  iterations: number;
  keySize: number;
  key: string;
}

export interface SavedAccount {
  address: string;
  encryptedAccountData: EncryptedAccountData;
  passwordHash: PasswordHash;
}

export const StorageKeys = {
  passwordHash: "passwordHash",
  address: "address",
  encryptedAccountData: "encryptedAccountData",
};

export const createPasswordHash = (password: string): PasswordHash => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iterations = 5000;
  const keySize = 256 / 32;
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize,
    iterations: iterations,
  });
  const passwordHash: PasswordHash = {
    hash: hash.toString(),
    salt: salt.toString(),
    iterations: iterations,
  };
  return passwordHash;
};

export const verifyPassword = async (
  passwordHash: PasswordHash,
  password: string
): Promise<boolean> => {
  const { salt, iterations, hash: storedHash } = passwordHash;
  const computedHash = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: iterations,
  });
  return computedHash.toString() === storedHash;
};

export const encryptAccount = (
  account: Account,
  password: string
): EncryptedAccountData => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iterations = 5000;
  const keySize = 256;
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
  const encryptedAccountData: EncryptedAccountData = {
    salt: salt.toString(),
    iterations: iterations,
    keySize: keySize,
    key: CryptoJS.AES.encrypt(mnemonic, key.toString()).toString(),
  };
  // return Buffer.from(JSON.stringify(encryptedAccountData), 'utf8').toString('base64');
  return encryptedAccountData;
};

export const decryptAccount = (
  encryptedAccountData: EncryptedAccountData,
  password: string
): Account => {
  try {
    const key = CryptoJS.PBKDF2(
      password,
      CryptoJS.enc.Hex.parse(encryptedAccountData.salt),
      {
        keySize: encryptedAccountData.keySize / 32,
        iterations: encryptedAccountData.iterations,
      }
    );

    const decryptedData = CryptoJS.AES.decrypt(
      encryptedAccountData.key,
      key.toString()
    ).toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Decryption failed.");
    }

    try {
      const account = algosdk.mnemonicToSecretKey(decryptedData);
      return account;
    } catch (e) {
      throw new Error("Malformed private key.");
    }
  } catch (e) {
    throw new Error("Invalid backup password.");
  }
};
