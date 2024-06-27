import CryptoJS from "crypto-js";
import uuidv4 from "uuid";

export const uuid = () => uuidv4();
export const encrypt = (x, sec) => CryptoJS.AES.encrypt(x, sec).toString();
export const decrypt = (x, sec) => CryptoJS.AES.decrypt(x, sec).toString(CryptoJS.enc.Utf8);
