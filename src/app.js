const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
var cons = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
const cookieparser = require("cookie-parser");
const auth = require("./middleware/auth");


// port number
const port = process.env.port || 5000;

// making a register schema
const Users = require('./models/users');

// statci files

// joining front end
app.set("view engine" , "pug");
app.set('/views' , path.join(__dirname , '../views'))

// app.use('public' , express.static('static'))
app.use('/static', express.static(__dirname + "/public"))

// make our code JSON user freindly
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieparser());

// database connection
require("./db/conn");

app.get("/" , (req , res) => {
    // res.send("This is start");
    res.render("index")
})

app.get("/demo" , auth ,async (req , res) => {
    // const cookieDemo = req.cookies.jwt;
    // console.log(`This is cookie demo ${cookieDemo}`);
    res.render("demo");
})

app.get("/apply" , (req , res) => {
    res.render("applicant");
})

app.get("/logout" , auth , async (req , res) => {
    try {
        console.log(req.user.tokens);
        console.log(req.user.tokens.filter((currElem) => {
            return currElem.token !== req.token
        }))

        res.clearCookie("jwt");
        console.log("Logout successfully");
        await req.user.save();
        res.render("index");
    } catch (error) {
        res.status(500).send("Logout error " + error);
    }
})

// signup handling
app.post("/signup" , async (req , res)=>{

    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        // console.log(`Password is ${password}`)
        // console.log(`Confirm Password is ${cpassword}`)
        // console.log(req.body)
        

        if(password === cpassword)
        {
            // console.log("Enter in if part");
            const userJoin = new Users({
                name : req.body.name,
                email : req.body.uemail,
                password : req.body.password,
                cpassword : req.body.cpassword,
                role : req.body.role
            });
            
            const token = await userJoin.generateAuthToken("signup");
            console.log(token)

            // store token in cookie
            res.cookie("jwt" , token , {
                expires : new Date(Date.now() + 3600000),
                httpOnly : true
                // also use secure : true but it only works in https
            })

            const joined = userJoin.save();
            console.log("User joined successfully " + joined);
            res.render("index");

        }

        else
        {
            res.send("Password aren't matched")
        }

    } catch (error) {
        res.status(400).send("Error part " + error)
    }
})


// login handling
app.post("/login" , async (req , res) => {

    try {
        const email = req.body.uemail;
        const password = req.body.password;
        const role = req.body.role;
    
        console.log(email)
        console.log(password)
        console.log(role)

        const myData = await Users.findOne({email : email});

        if(password === myData.password)
        {
            // creating a token or cookie
            const token = await myData.generateAuthToken("login");

            // cookie generate 
            // store token in cookie
            res.cookie("jwt" , token , {
                expires : new Date(Date.now() + 3600000),
                httpOnly : true
                // also use secure : true but it only works in https
            })

            res.status(201).render("index");
        }
    } catch (error) {
        res.status(400).send("Error part")
    }
})

app.listen(port , () => {
    console.log(`App listening on port number ${port}`);
})