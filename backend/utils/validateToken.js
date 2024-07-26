const wrapAsync = require("./wrapAsync");
const jwt = require("jsonwebtoken");
const User = require("../model/user");


const validateToken = async (token) => {
  try {
    if (token==null) {
      return {
        success:false,
        message: "session out",
        logout: true,
      };
    }
    const decode = jwt.verify(token, process.env.JWT_SCERET_KEY);
    const user = await User.findById(decode.id).select("-password");
    return {
      success:true,
      logout:false,
      user:user
    };
  } catch (err) {
    return{
      success:false,
      message:"token Expired Login Again",
      logout:true
    }
  }
};

module.exports = validateToken;
