/* import {dirname} from 'path'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url' */
import { prisma } from '../../config/db.js'

const showAll = (req, res) => {
    /* const data = JSON.parse(fs.readFileSync(path.join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'images.json')))
    res.render('show', {data}) */
    const data = prisma.products.findMany()
    res.json({data})
}

export {showAll}