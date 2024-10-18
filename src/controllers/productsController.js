import { prisma } from "../../config/db.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import fs from 'fs'

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
        let imagename = '';
        let imgPath = '';
        
        if(req.file) {
            imagename = req.file.filename;
            imgPath = path.join(dirname(fileURLToPath(import.meta.url)), 'uploads', imagename);
        }
        const { title, description, price, stock} = req.body 
    
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

const updateController = async (req, res) => {
    try {
        const { title, description, price, stock, id } = req.body
        const data = {title, description, price: Number(price), stock: Number(stock)}
        if(req.file) {
            data['img_url'] = req.file.filename
        }
        await prisma.products.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        res.json({message: 'Funca'})
    } catch (error) {
        res.status(500).json({message: 'There was an error'})
    }
}

const deleteController = async (req, res) => {
    try {
        const { id } = req.body
        console.log('empieza');
        
        const result = await prisma.products.findUnique({
            where: {
                id: Number(id)
            }
        });

        const imgPath = path.join(dirname(fileURLToPath(import.meta.url)), '..', 'uploads', result.img_url);

        if(fs.existsSync(imgPath)) {
            fs.unlink(imgPath, (err) => {
                if(err) {
                    console.error(err)
                } else {
                    console.log('Success')
                }
            })
        }

        await prisma.products.delete({where: {id: Number(id)}})

        res.json({message: 'Deleted successfully'});
    } catch (error) {
        /* res.status(500).json({message: 'There was an error'}) */
        res.sendStatus(500);
    }
}

export { getAll, getById, create, updateController, deleteController }