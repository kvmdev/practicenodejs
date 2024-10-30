import {z} from 'zod'

const productSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(150),
    price: z.string().min(1),
    stock: z.string().min(1)
})

export default productSchema