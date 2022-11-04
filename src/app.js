const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
var cons = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
const cookieparser = require("cookie-parser");
const auth = require("./middleware/auth");
const upload = require("./middleware/upload")
const uploadcompany = require("./middleware/uploadcompany")


// port number
const port = process.env.port || 1000;

// making a register schema
const Users = require('./models/users');
const Applicant = require('./models/applicant')
const Company = require('./models/company')

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

// home page of website handle

app.get("/" , (req , res) => {
    // res.send("This is start");
    res.render("index")
})

app.get("/demo" , auth ,async (req , res) => {
    // const cookieDemo = req.cookies.jwt;
    // console.log(`This is cookie demo ${cookieDemo}`);
    res.render("demo");
})

// employee section handled

app.get("/applicant" , auth , async (req , res) => {
    res.render("applicant")
})

app.get("/applicantform" , auth , async (req , res) => {
    res.render("applicantform")
})

app.get("/applicantedit" , auth , (req , res) => {
    res.render("applicanteditForm")
})


// company section handled
app.get("/company" , auth , (req , res) => {
    res.render("company");
})

app.get("/companyform" , auth , (req , res) => {
    res.render("companyform");
})




// login signup and logout handled


//       (1)  signup handling

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
            res.render("applicant");

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

            res.status(201).render("applicant");
        }
    } catch (error) {
        res.status(400).send("Error part")
    }
})

// logout handling
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

// applicant form handling
app.post("/applicantForm" , upload.fields([{name :'image_upload'} , {name : 'resume_upload'}]) , async (req , res) => {
    try {

        const applicantData = new Applicant({
            name : req.body.appname,
            address : req.body.appadress,
            email : req.body.appemail,
            phoneno : req.body.appphone,
            dob : req.body.appdob,
            gender : req.body.appgender,
            nationality : req.body.appnationality,
            qualifications : req.body.appqualifications,
            jobexperience : req.body.appjob,
            skills : req.body.appskills,
            biodata : req.body.appbio,
            githuburl : req.body.appgithub,
            uploadphoto : req.files['image_upload'][0].filename,
            uploadresume : req.files['resume_upload'][0].filename
        })
        const applicantRegister = applicantData.save()
        res.render("applicant") 
    } catch (error) {
        res.status(400).send("Applicant form error : " + error)
    }
})

// company form submit
app.post("/companyform" , uploadcompany.fields([{name : 'circular_upload'} , {name : 'verified_upload'}]) , async (req , res) => {
    try {

        const companyData = new Company({
            companyname : req.body.compname,
            companytype : req.body.comptype,
            address : req.body.compaddress,
            companyemail : req.body.compemail,
            telephone : req.body.comptelephone,
            departments : req.body.compdepartment,
            post : req.body.comppost,
            skillreq : req.body.compskillreq,
            vacancy : req.body.compvacancy,
            experience : req.body.compexperience,
            qualifications : req.body.compqualireq,
            circular : req.files['circular_upload'][0].filename,
            verifiedcertificate : req.files['verified_upload'][0].filename,
            formdeadline : req.body.compdeadline
        })
        // console.log(req.files['resume_upload'][0].filename)
        const applicantRegister = companyData.save()
        console.log(companyData)

        res.render("company") 
    } catch (error) {
        res.status(400).send("Applicant form error : " + error)
    }
})

// app listening on port 1000
app.listen(port , () => {
    console.log(`App listening on port number ${port}`);
})