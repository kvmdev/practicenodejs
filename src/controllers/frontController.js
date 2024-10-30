import { prisma } from "../../config/db.js";

const showAll = async (req, res) => {
  try {
    const limit = 10
    const offset = parseInt(req.query.offset) || 1
    let skip = (offset * limit) - limit;

    const data = await prisma.products.findMany({
      take: limit,
      skip
    })

    let count = await prisma.products.count();
    count = count > 10 ? parseInt(count / 10) + 1 : 1;

    res.render("show", { data, count })
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
