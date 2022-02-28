import path from "path";
import { stat, mkdir, writeFile, appendFile } from "fs";
import promisify from "./promisify.js";
import getDirname from "./__dirname.js";

const statPro = promisify(stat);
const mkdirPro = promisify(mkdir);
const appendFilePro = promisify(appendFile);
const writeFilePro = promisify(writeFile);

/**
 * 判断文件是否存在
 */
export async function isExit(p) {
  const { __dirname } = getDirname(import.meta.url);
  p = path.resolve(__dirname, p);
  let ret = false;
  try {
    await statPro(p);
    ret = true;
  } catch (e) {
    ret = false;
  }

  return ret;
}

/**
 * 创建文件夹
 */
export async function createDir(p) {
  const dirs = p.split("/");
  const { __dirname } = getDirname(import.meta.url);

  let curpath = __dirname;
  for (let it of dirs) {
    curpath = path.resolve(curpath, it);

    if (await isExit(curpath)) continue;
    await mkdirPro(curpath);
  }

  return true;
}

/**
 * 创建文件
 */
export async function createFile(p, content) {
  const paths = p.split("/");
  const [filename] = paths.splice(paths.length - 1, 1);
  const dirpath = paths.join("/");
  await createDir(dirpath);

  if (await isExit(p)) {
    // await appendFilePro(p, content);
    return `${filename} 内容追加成功`;
  }
  await writeFilePro(p, content, "utf8");
  return `${filename} 创建成功`;
}
