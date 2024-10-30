import productSchema from "../schemas/Product.js";

const validate = (req, res, next) => {
    const parseResult = productSchema.safeParse(req.body)
    if(!parseResult.success) {
        return res.status(400).json({errors: parseResult.error.errors})
    }

    req.validatedData = parseResult.data

    next()
}

export {validate}