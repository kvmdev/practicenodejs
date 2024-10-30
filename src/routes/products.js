import { Router } from "express"
import { createController, deleteController, getAllController, updateController } from "../controllers/productsController.js"
import { storage } from "../service/multerUploader.js"
import multer from "multer"
import { validate } from "../middlewares/validator.js"
const upload = multer({storage})


const router = Router()

router.get('/', getAllController)
router.post('/', upload.single('image'), validate, createController)
router.put('/', upload.single('image'), validate, updateController)
router.delete('/', deleteController)

export default router