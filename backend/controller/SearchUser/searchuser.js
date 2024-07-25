const User = require("../../model/user");
const wrapAsync = require("../../utils/wrapAsync");

const searchUser = wrapAsync(async (req, res) => {
  try {
    const { search } = req.body;
    // console.log(search);

    const query = new RegExp(search, "i");

    const user = await User.find({
      "$or": [{ name: query }, { email: query }],
    }).select("-password");

    return res.json({
      success: true,
      data: user,
      message: "Users found",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = searchUser;
