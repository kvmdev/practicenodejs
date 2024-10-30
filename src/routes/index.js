import { Router } from "express";
import { readdirSync } from 'fs';
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from 'url';

const router = Router();

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cleanFileName = (fileName) => {
    return fileName.split('.').shift() || '';
}

readdirSync(__dirname).filter((fileName) => {
    const cleanName = cleanFileName(fileName);
    
    if (cleanName !== 'index') {
        // Convert the path to a valid file:// URL
        const modulePath = pathToFileURL(join(__dirname, fileName)).href;
        import(modulePath).then((moduleRouter) => {
            // Associate the route with the file name
            router.use(`/${cleanName}`, moduleRouter.default);
        });
    }
});

export default router;