import { prisma } from "../../config/db.js"

const getAllController = async (req, res) => {
    try {
        const categories = await prisma.category.findMany()
        res.json(categories)
    } catch (error) {
        res.status(500).json({message: 'There was an error'})
    }
}

const getByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const category = await prisma.category.findUnique({
            where: {
                id: Number(id)
            }
        })
        if(category) {
            res.json(category)
        }
    } catch (error) {
        res.status(404).json({message: 'There was no category found'})
    }
}

const createController = async (req, res) => {
    try {
        const data = req.body
        await prisma.category.create({
            data
        })
        res.json({message: 'Created successfully'})
    } catch (error) {
        res.status(500).json({message: 'There was an error'})
    }
}

export { getByIdController, getAllController, createController }