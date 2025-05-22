import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = ")Kzdm[Ruh4B-SA!?fyCNt1ci=)9a&)2^EtmEIxt[q`a5Y58(qNf-_oZdbz(o41,"

export const decryptBody = (body: any) => {
    const decrypted = CryptoJS.AES.decrypt(atob(body), ENCRYPTION_KEY);

    return decrypted.toString(CryptoJS.enc.Utf8);
}
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



// const M = "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";
// const C = ")Kzdm[Ruh4B-SA!?fyCNt1ci=)9a&)2^EtmEIxt[q`a5Y58(qNf-_oZdbz(o41,";

// console.log(opensslDecrypt(M, C));

// function generateKey(u: string, C: string) {
//     return CryptoJS.PBKDF2(C, CryptoJS.enc.Utf8.parse(u), {
//         keySize: 128 / 32,
//         iterations: 1000,
//         hasher: CryptoJS.algo.SHA256
//     });
// }

// export function decrypt(u: string, d: string, C: string, M: string) {
//     const key = generateKey(u, C);
//     const ivHex = d.replace(/-/g, '');
//     if (ivHex.length !== 32) {
//         throw new Error('IV inválido. Deve conter 16 bytes (32 caracteres hexadecimais).');
//     }

//     const iv = CryptoJS.enc.Hex.parse(ivHex);

//     const encrypted = CryptoJS.lib.CipherParams.create({
//         ciphertext: CryptoJS.enc.Base64.parse(M)
//     });

//     const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv });

//     try {
//         const result = decrypted.toString(CryptoJS.enc.Utf8);
//         if (!result) throw new Error();
//         return result;
//     } catch {
//         console.log("Decrypted (Base64):", CryptoJS.enc.Base64.stringify(decrypted));
//         throw new Error('Falha na descriptografia. A chave ou IV estão incorretos ou o conteúdo não é texto.');
//     }
// }

// // Parâmetros de entrada
// const u = "10";
// const d = "8cb902e7-8193-437e-b322-95c7d60d4d80"; // UUID em formato hexadecimal
// const C = ")Kzdm[Ruh4B-SA!?fyCNt1ci=)9a&)2^EtmEIxt[q`a5Y58(qNf-_oZdbz(o41,";
// const M = "U2FsdGVkX19PG+DWisMZGwPCVitXPSkqV2OuuyoukcTaIRYbNPiccx2Ff3wN95jA+3evGk+cuKUuTRbFMF3hY+oqPIqgG0pzoUu4Thwv7bU="

// console.log(decrypt(u, d, C, M));

// export function encrypt(plaintext: string, u: string, d: string, C: string): string {
//     const key = generateKey(u, C);
//     const iv = CryptoJS.enc.Hex.parse(d.replace(/-/g, ''));

//     const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv });
//     return encrypted.toString(); // Base64
// }

// // function testRoundTrip() {
// //     const u = "10";
// //     const d = "8cb902e7-8193-437e-b322-95c7d60d4d80";
// //     const C = ")Kzdm[Ruh4B-SA!?fyCNt1ci=)9a&)2^EtmEIxt[q`a5Y58(qNf-_oZdbz(o41,";
// //     const plaintext = "Olá mundo secreto";

// //     const M = encrypt(plaintext, u, d, C);
// //     console.log("Encrypted:", M);

// //     const decrypted = decrypt(u, d, C, M);
// //     console.log("Decrypted:", decrypted);
// // }

// // testRoundTrip();

