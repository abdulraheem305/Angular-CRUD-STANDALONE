import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-very-secret-key';

export function encryptId(id: string): string {
    return CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
}

export function decryptId(encryptedId: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
