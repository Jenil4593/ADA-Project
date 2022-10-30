const mongoose = require("mongoose");
require("dotenv").config({path : '../../.env'});

mongoose.connect('mongodb://localhost:27017/ojasDB').then(()=> {
    console.log("Database connection is successfull");
}).catch((e)=>{
    console.log("Database crashed")
})
