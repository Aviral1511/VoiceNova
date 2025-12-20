import multer from "multer";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    destination: (req, file, cb) => {
        cb(null, './public');
    }
});

const upload = multer({ storage });

export default upload;