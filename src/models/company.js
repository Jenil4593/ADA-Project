const mongoose = require ("mongoose");
const validator = require("validator");

const companyschema = new mongoose.Schema({
    companyname : {
        type: String,
        require: true
    },

    companytype : {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public',
        require: true,
    },

    address:{
        type:String,
        require:true,
    },

    companyemail:{
        type:String,
        require: true,
        unique: [true, "Email id already prsented."],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },

    telephone:{
        type:Number,
        min: 10,
        require: true,
        unique: true
    },

    departments:{
        type:Array,
        require: true,
    },

    post:{
        type: String,
        require: true,
    },

    skillreq:{
        type: Array,
        require: true,
    },

    vacancy:{
        type: Number,
        title: String,
        require: true,
    },
    
    experience:{
        type:Number,
        require: true,
    },

    qualifications:{
        type: Array
    },

    circular:{
        type : String,
        require : true
    },

    verifiedcertificate:{
        type:String,
        require:true
    },

    formdeadline:{
        type: Date,
    }
})

const Company = new mongoose.model("company",companyschema);
module.exports = Company;