import path from "path";
import promisify from "./promisify.js";
import { readFile, readdir, stat, writeFile, appendFile } from "fs";
import getLinks from "./getLinks.js";
import fetch from 'node-fetch';
import { createFile, isExit } from "./create.js";

const readdirPro = promisify(readdir);
const readFilePro = promisify(readFile);
const writeFilePro = promisify(writeFile);
const appendFilePro = promisify(appendFile);
const statPro = promisify(stat);

const URL_LOG_FILE_PATH = path.resolve("./logFile.txt");
const EXINCLUDE_NAMES = [".git", "_h"];
const DOWNLOAD_URL_REG = [/gw.alipayobjects.com/, /\.(jpg|png|svg|json|csv)$/]

async function isDir(p) {
  const statObj = await statPro(p);
  return statObj.isDirectory();
}

async function downloadFile(link) {
  const filePath = path.join('./downloads', link.replace(/(^\w+:|^)\/\//, ''))

  if(await isExit(filePath)) return true
  const resp = await fetch(link).catch(e => console.error(e))
  if(!resp) return false
  const body = await resp.text()

  

  await createFile(filePath, body)
}

/**
 * p必须是绝对路径
 */
async function recursionDirs(p) {
  const names = await readdirPro(p);

  for (let name of names) {
    if (EXINCLUDE_NAMES.includes(name)) continue;

    const curpath = path.join(p, name);
    const isdir = await isDir(curpath);

    if (!isdir) {
      const links = getLinks(await readFilePro(curpath, "utf8"))
      for(let link of links) {
        if (DOWNLOAD_URL_REG.some(reg => reg.test(link))){
          if(link.endsWith('geo-data-v0.1.1') || link.endsWith('administrative-data')) continue
          console.log(`[downloads]: 开始下载${link}`)
           await downloadFile(link)
           await appendFilePro(URL_LOG_FILE_PATH, link + ', ')
        }
      }
    } else await recursionDirs(curpath);
  }

  return "done";
}

(async function () {
  // warnning
  await writeFilePro(URL_LOG_FILE_PATH, "");

  await recursionDirs(path.resolve("../"));

  console.log("完成文件下载任务");
})();
