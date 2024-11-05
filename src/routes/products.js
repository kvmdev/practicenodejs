import { Router } from "express"
import { createController, deleteController, getAllController, getById, updateController } from "../controllers/productsController.js"
import { storage } from "../service/multerUploader.js"
import multer from "multer"
import { validate } from "../middlewares/validator.js"
const upload = multer({storage})
import productSchema from "../schemas/Product.js"


const router = Router()

router.get('/', getAllController)
router.get('/:id', getById)
router.post('/', upload.single('image'), (req, res, next) =>  validate(req, res, next, productSchema), createController)
router.put('/', upload.single('image'), (req, res, next) =>  validate(req, res, next, productSchema), updateController)
router.delete('/', deleteController)

export default router