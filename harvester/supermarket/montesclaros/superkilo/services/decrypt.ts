import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = ")Kzdm[Ruh4B-SA!?fyCNt1ci=)9a&)2^EtmEIxt[q`a5Y58(qNf-_oZdbz(o41,"

export const decryptBody = (body: any) => {
    const decrypted = CryptoJS.AES.decrypt(atob(body), ENCRYPTION_KEY);

    return decrypted.toString(CryptoJS.enc.Utf8);
}

// export function encrypt(plaintext: string, u: string, d: string, C: string): string {
//     const key = generateKey(u, C);
//     const iv = CryptoJS.enc.Hex.parse(d.replace(/-/g, ''));

//     const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv });
//     return encrypted.toString(); // Base64
// }

// const encryptionSalt = "10"
// const encryptionIv = "8cb902e7-8193-437e-b322-95c7d60d4d80"
// const encryptionKey = ")Kzdm[Ruh4B-SA!?fyCNt1ci=)9a&)2^EtmEIxt[q`a5Y58(qNf-_oZdbz(o41,"
// const payload = "aA0LpLN4s6gb6gB9Jx/BV0Pg1kEDWm2WlYcZ0hgRcvkn1udyS3LkyWJOPh9hymwfrJnlnm4e0ki+X4ajCkU5aos0L9OdJnBcIElnMA9hbe9kAEvbV7z+hhMBftxSDTvXgME15vp0B9jQH2dLaJ8OZZLkwqAcHb5ys2fSoLtP2nX5BCou7Tl6Cct2PXtWBhjK"

export function opensslDecrypt(base64: string, passphrase: string): string {
    const data = CryptoJS.enc.Base64.parse((base64));
    const saltHeader = CryptoJS.enc.Utf8.parse("Salted__");
    const salt = CryptoJS.lib.WordArray.create(
        data.words.slice(2, 4), // pega os 8 bytes após "Salted__"
        8
    );

    // EVP_BytesToKey (OpenSSL key derivation)
    const keyAndIV = CryptoJS.EvpKDF(passphrase, salt, {
        keySize: 256 / 32 + 128 / 32, // key + IV
        iterations: 1,
        hasher: CryptoJS.algo.MD5,
    });

    const key = CryptoJS.lib.WordArray.create(
        keyAndIV.words.slice(0, 8),
        32 // 256-bit key
    );
    const iv = CryptoJS.lib.WordArray.create(
        keyAndIV.words.slice(8, 12),
        16 // 128-bit IV
    );

    const encrypted = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.lib.WordArray.create(data.words.slice(4), data.sigBytes - 16),
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
}