import { prisma } from "../../config/db.js";

const showAll = async (req, res) => {
  try {
    const data = await prisma.products.findMany()
    res.render("show", { data })
  } catch (error) {
    res.send('error')
  }
}

const update = async (req, res)=> {
    try {
        const { id } = req.query
        const data = await prisma.products.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        res.render('update', {data})
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export { showAll, update };
