import { prisma } from "../../config/db.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const getAll = async (req, res) => {
    try {
        const products = await prisma.products.findMany()
        res.json({products})
    } catch (error) {
        res.status(500).json({message: 'There was an error'})
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await prisma.products.findUnique({
            where: {
                id: id
            }
        })
        res.json({ product })
    } catch (error) {
        res.status(500).json({message: 'There was an error'})
    }
}

const create = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(500).json({message: 'There was no file uploaded'})
        }
        const { title, description, price, stock} = req.body
        const imagename = req.file.filename; // Save only the filename
        const imgPath = path.join(dirname(fileURLToPath(import.meta.url)), 'uploads', imagename)
    
        const imageMetadata = {
            img_url: imagename, // Store the filename only
            title, // Get title from the form
            description, // Get description from the form
            price: Number(price), // Get price from the form
            stock: Number(stock) // Get stock from the form
        };

        await prisma.products.create({data: imageMetadata})
        console.log('oiko')
        res.status(200).json({message: 'Created successfully', imgPath})
    } catch (error) {
        res.status(500).json({message: 'There was an error', error})
    }

}

export { getAll, getById, create }