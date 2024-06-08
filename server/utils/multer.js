import multer from "multer"
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, 'uploads/')
    },
    filename: (req, file, done) => {
        const prefix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        const fileTypes = /jpeg|jpg|png/
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimeType = fileTypes.test(file.mimetype) 

        if(extname && mimeType){
            done(null, file.fieldname + '-' + prefix)
        }else{
            done(new Error('File type not supported'))
        }
    }
})

const upload = multer({
    storage,
})

export default upload