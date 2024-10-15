import multer from "multer"
import path, {dirname} from 'path'
import { fileURLToPath } from "url"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(dirname(fileURLToPath(import.meta.url)), '..', 'uploads')
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = path.extname(file.originalname)
        cb(null, file.filename + '-' + uniqueSuffix + extension)
    }
})

export { storage }