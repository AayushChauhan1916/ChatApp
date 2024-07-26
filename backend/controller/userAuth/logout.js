const wrapAsync = require("../../utils/wrapAsync");

const logOut = wrapAsync(async(req,res)=>{
    const cookieOption = {
        http:true,
        secure:true
    }

    res.cookie("token","",cookieOption).status(200).json({
        success:true,
        logout:true,
        message:"LogOut Successfully",
    })
})

module.exports = logOut;