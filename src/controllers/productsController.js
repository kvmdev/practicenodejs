import { prisma } from "../../config/db.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import fs from 'fs'
import { createRandomName } from "../service/nameGenerator.js"

const imgPath = path.join(dirname(fileURLToPath(import.meta.url)), '..', 'uploads')

const getAllController = async (req, res) => {
    try {
        const limit = 10

        const page = Number(req.query.page) || 1;

        let skip = (page * limit) - limit
    
        const data = await prisma.products.findMany({
            include: {
                category: true
            },
          take: limit,
          skip
        })
    
        let count = await prisma.products.count()
        count = count > 10 ? parseInt(count / 10) + 1 : 1
    
        res.json({data, count, quantity: data.length})
      } catch (error) {
        res.json({message: 'There was an error'})
      }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await prisma.products.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                category: true
            }
        })
        if(!product) {
            return res.status(404).json({message: 'The product doesnt exist'})
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({message: 'There was an error'})
    }
}

const createController = async (req, res) => {
    try {

        const { title, description, price, stock, category_id } = req.validatedData

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
            price: price, // Get price from the form
            stock: stock, // Get stock from the form
            category_id
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
        const { title, description, price, stock, category_id } = req.validatedData
        const { id } = req.query
        let imagename = ''
        const product = await prisma.products.findUnique({
            where: {
                id: Number(id)
            }
        })
        if(!product) {
            console.log('Not found product 404')
            return res.status(404).json({message: `The product doesn't exist`})
        }
        const data = {title, description, price: Number(price), stock: Number(stock), img_url: product.img_url, category_id: Number(category_id)}

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
        console.log(error)
        res.status(500).json({message: 'There was an error'})
    }
}

const deleteController = async (req, res) => {
    try {
        const { id } = req.query
        
        const product = await prisma.products.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!product) {
            return res.status(404).json({message: 'The product doesnt exist'})
        }

        const imgPath = path.join(dirname(fileURLToPath(import.meta.url)), '..', 'uploads', product.img_url);

        const result = await prisma.products.delete({where: {id: Number(id)}})

        if(!result) {
            return res.status(500).json({message: 'There was an error'})
        }

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


        res.json({message: 'Deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'There was an error'});
    }
}

export { getAllController, getById, createController, updateController, deleteController }