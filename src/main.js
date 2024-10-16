import { prisma } from "../config/db.js"
import { create, getAll } from "./controllers/productsController.js"
import express from "express"
import path, { dirname } from 'path'
import { fileURLToPath } from "url" 
import { join } from "path"
import multer from "multer"
import { storage } from "./service/multerUploader.js"
import { showAll } from "./controllers/frontController.js"


const app = express()
app.set('view engine', 'ejs')
app.set('views', join(dirname(fileURLToPath(import.meta.url)), 'views'))
app.use('/uploads', express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'uploads')));

const upload = multer({storage})

app.use(async (req, res, next)=> {
    try {
        prisma.$connect()
        console.log('Connected successfully')
        next()
    } catch (error) {
        res.status(500).json({message: 'There was an error when trying to connect'})
    }
})

app.get('/', (req, res) => {
    res.render('create')
}) 

app.get('/show', showAll)

app.post('/createProduct', upload.single('image'), create)

app.listen(3000, ()=> {
    console.log('http://localhost:3000/')
})