const express = require('express')
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const User = require('./models/user')
 require('./database')
 const authen = require('./authen')

const app = express();
const PORT = 8000;
 
app.set("view engine", "ejs");
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());


app.get("/home", authen, (req, res)=>{
    res.send("home")
})

app.get("/register", (req, res)=>{
    res.send("hi")
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
            return res.json({ message: "*Phone number already exists" })
        }

        const user = new User({ name: name, phone: phone, password: password });

        const userRegister = await user.save()

        if (userRegister) {
            res.status(201).render('login')
        }
        else {
            res.status(500).json({ error: "Failed to register" })

        }
    } catch (error) {
        console.log(error);
    }


})


app.get('/l', (req, res) => {
    res.send('login')
})

app.post("/l",async (req, res)=>{
    // console.log("hiho");
    try {
        
        let token;
        const { name, phone, password } = req.body; 
        // console.log(name); 
        if (!name || !phone || !password) {
            return res.status(400).json( { fields: "*Fill all the fields" })
        }

        const userLogin = await User.findOne({ phone: phone });
        // console.log(userLogin);
        if(userLogin.password == password && userLogin.name ==name && userLogin.phone == phone){
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),     
                httpOnly: true

            })
            console.log("logged");
            res.render("register", {msg: "Registered successfully "})
        }

        else{
            res.json({msg: "*Invalid credentials"})
        }

        
    } catch (error) {
        console.log(error);
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
