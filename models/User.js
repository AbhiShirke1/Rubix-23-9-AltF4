// const mongoose = require('../database')
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 2,
        max: 20
    },

    phone:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
        min: 2,
        max: 12
    },

    location:{
        type: String,
        // required: true,
    },

    category:{
        type: Array,
        default: []
    },

    stock:{
        type: Array,
        default: []
    },

    weight:{
        type: String,
        // required: true,
    },

    price:{
        type: String,
        // required: true,
    }
})

userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token
    } catch (error) {
        console.log(error);
    }
}


// userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;