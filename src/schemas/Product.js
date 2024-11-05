import {z} from 'zod'

const productSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(200),
    price: z.number(),
    stock: z.number(),
    category_id: z.number()
})

export default productSchema