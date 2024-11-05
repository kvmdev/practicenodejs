import { Router } from "express"
import { createController, getAllController, getByIdController } from "../controllers/categoriesController.js"

const router = Router()

router.get('/', getAllController)

router.get('/:id', getByIdController)

router.post('/', createController)

export default router