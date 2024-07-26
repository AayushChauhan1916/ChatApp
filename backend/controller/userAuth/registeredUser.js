const wrapAsync = require("../../utils/wrapAsync");
const User = require("../../model/user");
const bcrypt = require('bcryptjs');


const registeredUser = wrapAsync(async (req,res)=>{
    const {name,email,password,profile} = req.body;


    const checkEmail = await User.findOne({email:email});

    if(checkEmail){
        return res.status(403).json({
            success:false,
            message:"User with given Email already Exists"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    let profileImage;
    
    if(req.body.profile){
        profileImage = {
            public_id:profile.public_id,
            url:profile.url
        }
    }

    const userInfo = {
        name : name,
        email : email,
        password:hashPassword,
        profile:profileImage
    }

    const user = new User(userInfo);

    await user.save();

    const fetchUser = await User.findOne({email:email}).select("-password");

    res.json({
        message:"User Created Successfully",
        data : fetchUser,
        success:true
    })

});

module.exports = registeredUser;