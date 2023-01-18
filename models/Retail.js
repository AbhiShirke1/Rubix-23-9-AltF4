const mongoose = require('mongoose')

const retailSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        
    },

    phone:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
        min: 2,
        max: 12
    },
})

retailSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token
    } catch (error) {
        console.log(error);
    }
}

const Retail = mongoose.model("Retail", retailSchema);
module.exports = Retail;