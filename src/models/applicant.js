const mongoose = require ("mongoose");
const validator = require("validator");

const applicantSchema = new mongoose.Schema({
    userid :
    {
        type : String
    },
    name : {
        type: String,
        require: true
    },

    address:{
        type:String,
        require:true,
    },

    email : {
        type : String , 
        required : true ,
        unique : true ,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Email is invalid");
            }
        }
    },

    phoneno:{
        type:Number,
        min: 10,
        require: true,
        unique: true
    },

    dob:{
        type: Date,
        require : true
    },

    gender : {
        type : Number,
        required : true
    },
    
    nationality : {
        type : String,
        required : true
    },

    qualifications:{
        type:Array,
        require: true,
    },

    jobexperience:{
        type: Number,
        require: true,
    },

    skills:{
        type: Array,
        require: true,
    },

    biodata:{
        type: String,
        require: true
    },
    
    githuburl:{
        type:String,
        require: true,
    },

    uploadphoto: String,
    
    uploadresume: String,
})

const Applicant = new mongoose.model("Applicant",applicantSchema);
module.exports = Applicant;