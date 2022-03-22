import { readFile, readdir, stat, writeFile, appendFile } from "fs";
import promisify from "./promisify.js";

export const readdirPro = promisify(readdir);
export const readFilePro = promisify(readFile);
export const writeFilePro = promisify(writeFile);
export const appendFilePro = promisify(appendFile);
export const statPro = promisify(stat);