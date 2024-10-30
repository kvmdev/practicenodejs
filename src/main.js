import { prisma } from "../config/db.js"
import express from "express"
import path, { dirname } from 'path'
import { fileURLToPath } from "url" 
import { join } from "path"
import router from "./routes/index.js"


const app = express()
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', join(dirname(fileURLToPath(import.meta.url)), 'views'))
app.use('/uploads', express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'uploads')))

app.use(async (req, res, next)=> {
    try {
        prisma.$connect()
        console.log('Connected successfully')
        next()
    } catch (error) {
        res.status(500).json({message: 'There was an error when trying to connect'})
    }
})

app.use('/api', router)

app.get('/', (req, res) => {
    res.render('create')
})

app.get('/show', (req, res) => {
    res.render('show')
})

app.get('/update', async (req, res) => {
    const { id } = req.query
    const data = await prisma.products.findUnique({
        where: {
            id: Number(id)
        }
    })
    res.render('update', {data})
})

app.listen(3000, ()=> {
    console.log('http://localhost:3000/')
})