const express = require('express')
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const User = require('./models/user')
const Retail = require('./models/Retail')
const path = require('path')
 require('./database')
 const authen = require('./authen')

const app = express();
const PORT = 8000;
 
app.set("view engine", "ejs");
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());
const staticpath = path.join(__dirname, "../public")
const img_path = path.join(__dirname, "./images")
app.use(express.static(img_path))
app.use(express.static(staticpath))


app.get("/home",  (req, res)=>{
    // res.send("home", {name: req.cookies.name})
    res.cookie('name', req.cookies.name).render("home")
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.post("/register", async(req, res)=>{
    const {name, phone, password} = req.body;

    if (!name || !phone || !password) {
        return res.status(422).json({ fields: "*Fill all the fields" })
    }

    if (name.length < 4) {
        return res.json({ fields: "*Username is too short" });
    }

    if (password.length < 4) {
        return res.json({ fields: "*Password is too short" });
    }

    try {
        const userExist = await User.findOne({ phone: phone })   //database: user entered

        if (userExist) {
            return res.render('register', { message: "*Phone number already exists" })
        }

        const user = new User({ name: name, phone: phone, password: password });
 
        const userRegister = await user.save()
        

        if (userRegister) {
            res.status(201).render('login')
        }
        else {
            res.status(500).render('register', { error: "Failed to register" })

        }
    } catch (error) {
        console.log(error);
    }


})


app.get("/retail/register", (req, res)=>{
    res.render('regr')
})

app.post("/retail/register", async(req, res)=>{
    const {name, phone, email, password} = req.body;


    if (!name || !phone || !password ||!email) {
        return res.status(422).json({ fields: "*Fill all the fields" })
    }

    if (name.length < 4) {
        return res.json({ fields: "*Username is too short" });
    }

    if (password.length < 4) {
        return res.json({ fields: "*Password is too short" });
    }

    try {
        const retailerExist = await Retail.findOne({ phone: phone }) 

        if (retailerExist) {
            return res.json({ message: "*Phone number already exists" })
        }

        const retail = new Retail({ name: name, phone: phone, email: email,  password: password });

        const retailerRegister = await retail.save()
        res.cookie('name', name)

        if (retailerRegister) {
            res.status(201).render('logr')
        }
        else {
            res.status(500).render('regr', { error: "Failed to register" })

        }
    } catch (error) {
        console.log(error);
    }
})



app.get('/login', (req, res) => {
    res.render('login')
})

app.post("/login",async (req, res)=>{
   
    try {
        
        let token;
        const { name, phone, password } = req.body; 
        // console.log(password); 
        if (!name || !phone || !password) {
            return res.status(400).json( { fields: "*Fill all the fields" })
        }

        const userLogin = await User.findOne({ phone: phone });
        res.cookie('name', name)
        // console.log(userLogin);
        if(!userLogin){
            res.render('login', {wrong: "*Invalid credentials"})
           
        }

        else{
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),     
                httpOnly: true

            })
            console.log("logged");
            res.redirect("/home")
        }

        
    } catch (error) {
        console.log(error);
    }
})

app.get('/retail/login', (req, res) => {
    res.render('logr')
})

app.post("/retail/login", async(req, res)=>{
    try {
        let token;
        const { name, phone,  password } = req.body; 
        // console.log(name); 
        if (!name || !phone || !password ) {
            return res.status(400).json( { fields: "*Fill all the fields" })
        }

        const userLogin = await Retail.findOne({ phone: phone });
        // console.log(userLogin);
        if(userLogin.password == password && userLogin.name ==name && userLogin.phone == phone ){
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),     
                httpOnly: true

            })
            // console.log("logged");
            res.cookie('name', name)
            res.redirect("/home")
        }

        else{
            res.send("logr", {msg: "*Invalid credentials"})
        }

        
    } catch (error) {
        console.log(error);
    }
})
 
app.get("/front", (req, res)=>{ 
    res.render("front")
})

// app.get("/home", (req, res)=>{

//     res.render("home")
// })

// app.post("/home", (req, res)=>{
//     const apple = req.body.apple;
//     console.log(apple);
//     res.render() 

// })


app.get("/reg", (req, res)=>{
    res.render('register')
})


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
