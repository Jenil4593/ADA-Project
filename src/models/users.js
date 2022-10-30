const mongoose = require("mongoose");
const validator = require("validator");
const passwordValidator = require("password-validator");
const jwt = require('jsonwebtoken');


// making schema of mongoose
const userSChema = new mongoose.Schema(
    {   
        name : {
            type : String , 
            required : true ,
            trim : true
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
    
        password : {
            type : String,
            required : true ,
            trim : true,
            validate(value)
            {
                const schema = new passwordValidator(value);
                schema.min(8);
                schema.max(20);
                schema.has().uppercase();                             // Must have uppercase letters
                schema.has().lowercase();                             // Must have lowercase letters
                schema.has().digits(2);                               // must have 2 digits

                if(!schema.validate(value))
                {
                    throw new Error("Invalid password")
                }
            }
        },
    
        cpassword : {
            type : String,
            required : true
        },

        role : {
            type : Number,
            required : true
        },

        tokens : [{
            token : {
                type : String ,
                required : true
            }
        }]
    }
)


// creating a web token
userSChema.methods.generateAuthToken = async function(whichToken){

    try {
        
        const token = jwt.sign({_id : this._id.toString()} , "mynameisjenilkamleshbhaithakorjs");   // jwt.sign(id , secret key)

        // this.tokens = this.tokens.concat({token : token});
        this.tokens = this.tokens.concat({token : whichToken + " : " + token});

        await this.save()


        return token;
    } catch (error) {
        
        console.log("Error part of token" + error);
        res.send("Error part of token" + error);
    }
}

// now we create a model

const User = new mongoose.model("User" , userSChema);

module.exports = User