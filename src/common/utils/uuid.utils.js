import {randomBytes, randomUUID} from "node:crypto";

export function genUUID() {
    return randomUUID();
}
/**
 * Generates a random token string
 * @param {number} size - Size in bytes (default: 16)
 * @returns {string} Base64url encoded random string
 */
export function randomByts(size = 16){
    return randomBytes(size).toString("base64url"); //22 char
}