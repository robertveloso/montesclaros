import CryptoJS from 'crypto-js';

export function opensslDecrypt(base64: string, passphrase: string): string {
    const data = CryptoJS.enc.Base64.parse(base64);
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



// const M = jsonEntry.response;
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

