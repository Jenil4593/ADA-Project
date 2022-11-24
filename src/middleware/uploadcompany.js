const multer = require("multer");
const path = require("path")

const Storage = multer.diskStorage(
    {
        destination : function(req , file , cb ){

            if(file.fieldname === 'circular_upload')
            {
                cb(null , 'C://Users//Jenil Thakor//OneDrive//Documents//GitHub//ADA-Project//src//public//uploads//company//circular');                
            }
            
            else if(file.fieldname === 'verified_upload')
            {
                cb(null , 'C://Users//Jenil Thakor//OneDrive//Documents//GitHub//ADA-Project//src//public//uploads//company//verified');                
            }
        },

        filename : function(req , file , cb) {
            const extname = path.extname(file.originalname);
            const uniqueKey = Date.now() + extname;
            cb(null ,  uniqueKey);
        }
    })

    const uploadcompany = multer({storage : Storage})
    module.exports = uploadcompany