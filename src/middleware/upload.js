const multer = require("multer")
const path = require('path')

const storage = multer.diskStorage(
    {
        destination : function(req , file , cb) {
            if(file.fieldname === 'image_upload')   
            {
                cb(null , '../public/uploads/applicant/photo');
                // cb(null , 'D:/JAY/WEB_DEVELOPMENT_CODE_WITH_HARRY/Node.js/OJAS/src/uploads/applicant/photo');
            }
            else if(file.fieldname === 'resume_upload')
            {
                cb(null , '../public/uploads/applicant/resume');
                // cb(null , 'D:/JAY/WEB_DEVELOPMENT_CODE_WITH_HARRY/Node.js/OJAS/src/uploads/applicant/resume');
            }
        } ,
        filename : function(req , file , cb) {
            const extname = path.extname(file.originalname);
            const uniqueKey = Date.now() + extname;
            cb(null ,  uniqueKey);
        }
    }
    )

    // req.filename = storage.filename

const upload = multer({storage : storage});
module.exports = upload