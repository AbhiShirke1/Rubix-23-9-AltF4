const jwtoken = require('jsonwebtoken')
const User = require('./models/user')

const authen = async(req, res, next) =>{
    try {
        const token = req.cookies.jwtoken;
        const verifyUser = jwtoken.verify(token, process.env.SECRET_KEY);
        
        const users = await User.findOne({_id:verifyUser._id})
        // console.log(verifyUser);
        // console.log(user);
        
        next();
    } catch (error) {
        res.status(401).redirect('/login')
    }
}

module.exports = authen;