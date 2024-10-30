import { prisma } from "../../config/db.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import fs from 'fs'
import { createRandomName } from "../service/nameGenerator.js"

const imgPath = path.join(dirname(fileURLToPath(import.meta.url)), '..', 'uploads')

const getAllController = async (req, res) => {
    try {
        const limit = 10
        const offset = parseInt(req.query.offset) || 1
        let skip = (offset * limit) - limit
    
        const data = await prisma.products.findMany({
          take: limit,
          skip
        })
    
        let count = await prisma.products.count()
        count = count > 10 ? parseInt(count / 10) + 1 : 1
    
        res.json({data, count, quantity: data.length})
      } catch (error) {
        res.send('error')
      }
}

const getById = async (req, res) => {
    try {
        const { id } = req.query
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

const createController = async (req, res) => {
    try {

        const { title, description, price, stock } = req.validatedData

        let imagename = ''
        
        if(req.file) {
            let extention = req.file.originalname.split('.')[1]
            imagename = createRandomName() + '.' + extention
            fs.writeFile(path.join(imgPath, imagename), req.file.buffer, (err) => {
                if(err) {
                    console.log('error aca')
                    return res.status(500).json({message: 'There was an error'})
                }
            })
        } 
    
        const imageMetadata = {
            img_url: imagename, // Store the filename only
            title, // Get title from the form
            description, // Get description from the form
            price: Number(price), // Get price from the form
            stock: Number(stock) // Get stock from the form
        }

        await prisma.products.create({data: imageMetadata})
        console.log('oiko')
        res.status(200).json({message: 'Created successfully'})
    } catch (error) {
        res.status(500).json({message: 'There was an error', error})
    }

}

const updateController = async (req, res) => {
    try {
        const { title, description, price, stock } = req.validatedData
        const { id } = req.query
        const product = await prisma.products.findUnique({
            where: {
                id: Number(id)
            }
        })
        const data = {title, description, price: Number(price), stock: Number(stock), img_url: product.img_url}

        if(req.file) {
            if(data.img_url) {
                fs.writeFile(path.join(imgPath, data.img_url), req.file.buffer, (err) => {
                    if(err) {
                        console.log('error aca')
                        return res.status(500).json({message: 'There was an error'})
                    }
                })
            } else {
                let extention = req.file.originalname.split('.')[1]
                imagename = createRandomName() + '.' + extention
                fs.writeFile(path.join(imgPath, imagename), req.file.buffer, (err) => {
                    if(err) {
                        console.log('error aca')
                        return res.status(500).json({message: 'There was an error'})
                    }
                })
                data.img_url = imagename
            }
        }
        await prisma.products.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        res.json({message: 'Updated successfully'})
    } catch (error) {
        res.status(500).json({message: 'There was an error'})
    }
}

const deleteController = async (req, res) => {
    try {
        const { id } = req.query
        
        const result = await prisma.products.findUnique({
            where: {
                id: Number(id)
            }
        });

        const imgPath = path.join(dirname(fileURLToPath(import.meta.url)), '..', 'uploads', result.img_url);

        if(fs.existsSync(imgPath)) {
            fs.unlink(imgPath, (err) => {
                if(err) {
                    return res.status(400).json({message: 'There was an error'
                })
                } else {
                    console.log('Success')
                }
            })
        }

        await prisma.products.delete({where: {id: Number(id)}})

        res.json({message: 'Deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'There was an error'});
    }
}

export { getAllController, getById, createController, updateController, deleteController }