import {dirname} from 'path'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const showAll = (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'images.json')))
    res.render('show', {data})
}

export {showAll}