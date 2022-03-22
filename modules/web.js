import express from 'express'
import path from 'path'
import debug from 'debug'
import getDirs from './__dirname.js'
import fs from "fs";
import { isExit } from './create.js';
import { readFilePro } from './fsWrapper.js';

const debugOutput = debug('_h:web')
const { __dirname } = getDirs(import.meta.url)

const app = new express()

// static server for docs
const rootPath = path.resolve(__dirname, '../../')
app.get('/*', async (req, res, next) => {
  const reqFilePath = req.params[0]
  const filePath = path.resolve(rootPath, './_H/downloads',reqFilePath)

  if(reqFilePath.includes('/img')) {
    res.set('Content-Type', 'image/png')
    if(await isExit(filePath)) {
      const content = await readFilePro(filePath, "utf8")
      // res.send(content.replace(/(http:|https:)\/\//g, '/_h/downloads/'))
      res.end(content)
    } else res.status(404).end()
  } else if (/(js)|(css)|(html)|(map)$/.test(filePath)) {
    if(await isExit(filePath)) {
      const content = await readFilePro(filePath, "utf8")
      res.send(content.replace(/(http:|https:)\/\//g, '/_h/downloads/'))
      res.end()
    } else res.status(404).end()

  } else {
    const stream = fs.createReadStream(filePath)

    stream.on('data', (chunk) => {
      res.write(chunk)
    })

    stream.on('end', () => {
      res.end()
    })

    stream.on('error', e => {
      res.send(e.message)
      res.status(400)
      res.end()
    })
  }

  
})

app.listen(80, () => {
  debugOutput('server is running')
})