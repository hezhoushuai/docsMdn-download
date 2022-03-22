import { readdirPro, statPro } from './fsWrapper.js';
import path from 'path';
import debug from 'debug';

const debugOutput = debug('_h:recursDirs')
const EXINCLUDE_NAMES = [".git", "_h"];

async function isDir(p) {
  const statObj = await statPro(p);
  return statObj.isDirectory();
}

/** 递归遍历文件夹，当是文件时会调用传入回调函数 **/
/** p must a absolute path **/
export default async function recursionDirs(p, callback) {
  const names = await readdirPro(p);

  for (let name of names) {
    if (EXINCLUDE_NAMES.includes(name)) continue;
    const curpath = path.join(p, name);
    const isdir = await isDir(curpath);
    debugOutput('curpath is ' + curpath)

    if (!isdir) {
      await callback(curpath).catch(e => { debugOutput('catch error: ' + e.message) })
    } else await recursionDirs(curpath, callback);
  }

  return "done";
}