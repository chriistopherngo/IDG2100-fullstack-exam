const multer = require('multer')


const bulkStorage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './bulkUploads/')
    },
    filename: function (req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})
 //  Storage for JSON or text files
const bulkUpload = multer({
    // Necessary for parsing JSON files with multer
    storage: multer.memoryStorage(),// https://stackoverflow.com/questions/64001893/parse-multipart-json-with-multer/64004724#64004724
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter: function(req, file, cb){
        // Only allow JSON files to be uploaded
        if(file.mimetype === 'text/plain' || file.mimetype === 'application/json'){
            return cb(null, true)
        } else {    
            return cb(new Error('Only JSON files allowed'), false)
        }
    }
})


// Storage for image files
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './uploads')
    },
    filename: function (req, file, cb ){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage: storage})


const iconStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const category = req.headers.category;
        cb(null, `icon-${category}.png`);
    }
});
const iconUpload = multer({ storage: iconStorage });





module.exports = {upload, bulkUpload,iconUpload}
