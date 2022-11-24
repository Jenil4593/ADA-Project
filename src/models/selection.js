const mongoose = require("mongoose")
const validator = require("validator")

const selectSchema = new mongoose.Schema({


    appliedid : 
    {
        type : String
    },

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
    },

    approved :
    {
        type : Number
    }
})

const Select = new mongoose.model("select",selectSchema);
module.exports = Select;