import CryptoJS from "crypto-js"

// Encrypt
export function encrypt(text, secretKey = process.env.ENCRPT_KEY) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Decrypt
export function decrypt(ciphertext, secretKey = process.env.ENCRPT_KEY) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
