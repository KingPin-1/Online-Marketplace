const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'content');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 100000 * 100 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png|mp4|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname));

        if (mimeType && extName) {
            return cb(null, true);
        }
        cb(
            'Error: File upload only supports the following filetypes - ' +
                fileTypes
        );
    },
}).single('content');

module.exports = upload;
