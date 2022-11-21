const mongoose = require("mongoose")
const validator = require("validator")

const applySchema = new mongoose.Schema({

    userid : 
    {
        type : String
    },

    applicationid :
    {
        type : String
    },

    companyid :
    {
        type : String
    }
})

const Apply = new mongoose.model("applied",applySchema);
module.exports = Apply;