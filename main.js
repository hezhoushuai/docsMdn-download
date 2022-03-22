import path from "path";
import debug from "debug";
import { readFilePro, writeFilePro, appendFilePro } from './modules/fsWrapper.js';
import { createWriteStream } from 'fs';
import getLinks from "./modules/getLinks.js";
import fetch from 'node-fetch';
import { createFile, isExit } from "./modules/create.js";
import recursionDirs from './modules/recursDirs.js'

const debugOutput = debug('_h:main')

const DOWNLOAD_DIR_PATH = path.resolve('./downloads')
const URL_LOG_FILE_PATH = path.resolve("./logFile.txt");
const DOWNLOAD_URL_REG = [/gw.alipayobjects.com/, /\.(jpg|png|svg|json|csv)$/]

async function downloadFile(link) {
  const filePath = path.join(DOWNLOAD_DIR_PATH, link.replace(/(^\w+:|^)\/\//, ''))

  if(await isExit(filePath)) return true
  const resp = await fetch(link, {
    method: 'GET',
    headers: { 'Content-Type': 'application/octet-stream' },
  }).catch(e => debugOutput(e.message))

  if(!resp) return false
  
  await createFile(filePath, '')
  const writeStream = createWriteStream(filePath)

  resp.body.pipe(writeStream)
}

(async function () {
  // warnning
  await writeFilePro(URL_LOG_FILE_PATH, "");

  await recursionDirs(path.resolve("../"), async (curpath) => {
    const links = getLinks(await readFilePro(curpath, "utf8"))
      for(let link of links) {
        if (DOWNLOAD_URL_REG.some(reg => reg.test(link))){
          debugOutput(`[downloads]: 开始下载${link}`)
           await downloadFile(link)
           await appendFilePro(URL_LOG_FILE_PATH, link + ', ')
        }
      }
  });

  debugOutput("完成文件下载任务");
})();

