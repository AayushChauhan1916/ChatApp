const wrapAsync = require("../../utils/wrapAsync");
const User = require("../../model/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const checkPassword = wrapAsync(async(req,res)=>{
    const {password,id} = req.body;

    const user = await User.findById(id);

    const verifyPassword = await bcrypt.compare(password,user.password);

    if(!verifyPassword){
        return res.status(400).json({
            success:false,
            message:"Incorrect password"
        })
    }

    const tokenPayload = {
        id:user._id,
        email:user.email
    }

    const token = await jwt.sign(tokenPayload,process.env.JWT_SCERET_KEY,{expiresIn:'1d'});

    const cookieOption = {
        http:true,
        secure:true,
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000
    }

    res.cookie("token",token,cookieOption).status(200).json({
        success:true,
        message:"Login Successfully",
        token:token
    })
})

module.exports = checkPassword;