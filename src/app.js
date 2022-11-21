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
const moment = require("moment")

// port number
const port = process.env.port || 1000;

// making a register schema
const Users = require('./models/users');
const Applicant = require('./models/applicant')
const Company = require('./models/company')
const Apply = require("./models/apply")

// statci files

// joining front end
app.set("view engine" , "pug");
app.set('/views' , path.join(__dirname , '../views'))

// app.use('public' , express.static('static'))
app.use('/public', express.static(__dirname + "/public"))

// make our code JSON user freindly
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieparser());

// database connection
require("./db/conn");

app.get("/companyshow/:id" , async (req , res) => {

    // const role = req.cookies.role;
    // console.log(req.params.id);
    // const applicantDetail = Applicant.findOne({_id : req.params.id});
    const companydetail = async () => {
        const result = await Company.find({_id : req.params.id})
        return result  
    }

    // console.log(applicantDetail.name);
    const record = await companydetail()
    const recordComp = record[0]
    console.log(recordComp)
    res.render("companydetail" , recordComp);
})

app.post("/apply" , async (req , res) => {

    const companyId = req.body.companyid;
    const userId = req.cookies.xyz;

    const applicantDetail = async() => {
        const result = await Applicant.find({userid : req.cookies.xyz})
        return result[0]
    }

    const applicant = await applicantDetail()
    const applicationId = applicant._id;
    console.log(applicationId)

    const applyData = new Apply({
        userid : userId ,
        applicationid : applicationId,
        companyid : companyId
    })

    const applied = applyData.save()
    res.redirect("/applicant")
})

// home page of website handle

app.get("/" , async (req , res) => {
    // res.send("This is start");
    const companies = async () => {
        const result = await Company.find()
        return result  
    }

    // // console.log(applicantDetail.name);
    const record = await companies()
    // const recordEmp = record[0]
    console.log(record)
    res.render("index" , {"recordComp" : record})
})

app.get("/demo" , auth ,async (req , res) => {
    // const cookieDemo = req.cookies.jwt;
    // console.log(`This is cookie demo ${cookieDemo}`);
    res.render("demo");
})

// employee section handled

app.get("/applicant" , auth , async (req , res) => {
    const role = req.cookies.role;

    // const applicantDetail = Applicant.findOne({_id : req.params.id});
    const companies = async () => {
        const result = await Company.find()
        return result  
    }

    // // console.log(applicantDetail.name);
    const record = await companies()
    // const recordEmp = record[0]
    // console.log(record)

    if(role == 0)
    {
        res.render("applicant" , {"recordComp" : record})
    }

    else if(role == 1)
    {
        res.render("company")
    }
})

app.get("/applicantform" , auth , async (req , res) => {
    const role = req.cookies.role;
    const xyz = req.cookies.xyz;
    // console.log(Applicant.find({userid : xyz}))
    const applicantDetail = async () => {
        const result = await Applicant.find({userid : xyz})
        return result  
    }
    const record = await applicantDetail()
    // console.log(record.length)
    if(role == 0)
    {
        if(record.length === 0)
        {
            return res.render("applicantform")
        }
        
        return res.render("main" , record[0])
    }

    else if(role == 1)
    {
        return res.redirect("/company")
    }
})

app.get("/applicantedit" , auth , async (req , res) => {
    const role = req.cookies.role;
    const xyz = req.cookies.xyz;

    const applicantDetail = async () => {
        const result = await Applicant.find({userid : xyz})
        return result  
    }
    const record = await applicantDetail()    

    if(role == 0)
    {
        res.render("applicanteditForm" , record[0])
    }

    else if(role == 1)
    {
        res.render("company")
    }
})


// company section handled
app.get("/company" , auth , (req , res) => {
    const role = req.cookies.role;
    if(role == 0)
    {
        res.render("applicant")
    }

    else if(role == 1)
    {
        res.render("company")
    }
})

app.get("/companyform" , auth , (req , res) => {
    const role = req.cookies.role;
    if(role == 0)
    {
        res.render("applicant")
    }

    else if(role == 1)
    {
        res.render("companyform")
    }
})

app.get("/companyedit" , auth , async (req , res) => {
    const role = req.cookies.role;
    const xyz = req.cookies.xyz;

    const companyDetail = async () => {
        const result = await Company.find({userid : xyz})
        return result  
    }
    const record = await companyDetail() 
    console.log(record)

    if(role == 0)
    {
        res.render("applicant")
    }

    else if(role == 1)
    {
        console.log(moment(record.formdeadline).format("MM/DD/YYYY"))
        res.render("companyDashboard" , {"companyData" : record })
    }
})

app.get("/companyeditdetail/:id" , auth ,async (req , res) => {
    const role = req.cookies.role;
    // console.log(req.params.id);
    // const applicantDetail = Applicant.findOne({_id : req.params.id});
    const companyDetails = async () => {
        const result = await Company.find({_id : req.params.id})
        return result  
    }

    // console.log(applicantDetail.name);
    const record = await companyDetails()
    const x = record[0].formdeadline.toString().slice(4,15)

    if(role == 0)
    {
        res.render("applicant")
    }

    else if(role == 1)
    {
        // console.log(moment(record[0].formdeadline).format("DD/MM/YYYY"))
        res.render("companyeditform" , {"record" : record[0]   , "date" : x})
    }
})

app.get("/applicantsdashboard" , auth ,async (req , res) => {
    const role = req.cookies.role;
    const applicantDetail = async () => {
        const result = await Applicant.find()
        return result  
    }
    const recordApp = await applicantDetail();
    console.log(recordApp);

    if(role == 0)
    {
        res.render("applicant")
    }

    else if(role == 1)
    {
        res.render("applicantsDashboard" , {"appData" : recordApp})
    }
})

app.get("/applicantdetail/:id" , auth ,async (req , res) => {
    const role = req.cookies.role;
    console.log(req.params.id);
    // const applicantDetail = Applicant.findOne({_id : req.params.id});
    const applicantDetail = async () => {
        const result = await Applicant.find({_id : req.params.id})
        return result  
    }

    // console.log(applicantDetail.name);
    const record = await applicantDetail()
    const recordEmp = record[0]

    if(role == 0)
    {
        res.render("applicant")
    }

    else if(role == 1)
    {
        res.render("applicantDetails" , recordEmp)
    }
})






// login signup and logout handled


//       (1)  signup handling

app.post("/signup" , async (req , res)=>{

    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const role = req.body.role;

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

            res.cookie("role" , userJoin.role , {
                expires : new Date(Date.now() + 3600000),
                httpOnly : true
            })
            
            
            res.cookie("xyz" , userJoin._id , {
                expires : new Date(Date.now() + 3600000),
                httpOnly : true
            })
            const joined = userJoin.save();
            
            console.log("User joined successfully " + joined);
            if(userJoin.role === 0)
            {
                res.redirect("/applicant");
            }
            
            else if(userJoin.role === 1)
            {
                res.redirect("/company");
            }

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

            res.cookie("jwt" , token , {
                expires : new Date(Date.now() + 3600000),
                httpOnly : true
                // also use secure : true but it only works in https
            })
            
            res.cookie("role" , myData.role , {
                expires : new Date(Date.now() + 3600000),
                httpOnly : true
            })

            res.cookie("xyz" , myData._id , {
                expires : new Date(Date.now() + 3600000),
                httpOnly : true
            })

        }
        if(myData.role == 0)
        {
            res.redirect("/applicant");
        }
        
        else if(myData.role == 1)
        {
            res.redirect("/company");
        }
    } catch (error) {
        res.status(400).send("Error part")
    }
})

// logout handling
app.get("/logout" , auth , async (req , res) => {
    try {

        res.clearCookie("jwt");
        res.clearCookie("role");
        res.clearCookie("xyz");
        console.log("Logout successfully");
        // await req.user.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Logout error " + error);
    }
})

// applicant form handling
app.post("/applicantForm" , upload.fields([{name :'image_upload'} , {name : 'resume_upload'}]) , async (req , res) => {
    try {

        const applicantData = new Applicant({
            userid : req.cookies.xyz,
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
            uploadresume : req.files['resume_upload'][0].filename,
        })


        const applicantRegister = applicantData.save()
        res.redirect("/applicant") 
    } catch (error) {
        res.status(400).send("Applicant form error : " + error)
    }
})

// company form submit
app.post("/companyform" , uploadcompany.fields([{name : 'circular_upload'} , {name : 'verified_upload'}]) , async (req , res) => {
    try {

        const companyData = new Company({
            userid : req.cookies.xyz,
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