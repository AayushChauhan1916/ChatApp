const validateToken = require("../../utils/validateToken");
const wrapAsync = require("../../utils/wrapAsync");

const userDetails = wrapAsync(async(req,res)=>{
    const token = req.cookies.token || null;

    const user = await validateToken(token);
    // console.log(user)

    res.status(200).json({
        data: user.user
    })
})

module.exports = userDetails;