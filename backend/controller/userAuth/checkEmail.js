const wrapAsync = require("../../utils/wrapAsync");
const User = require("../../model/user");

const checkEmail = wrapAsync(async (req, res) => {
  const { email } = req.body;

  const checkEmail = await User.findOne({ email: email }).select("-password");

  if (!checkEmail) {
    return res.status(400).json({
      success: false,
      message: "User Doesn't Exits",
    });
  }

  res.status(200).json({
    success: true,
    message: "Email Verify",
    data: checkEmail,
  });
});

module.exports = checkEmail;
