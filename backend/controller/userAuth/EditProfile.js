const wrapAsync = require("../../utils/wrapAsync");
const User = require("../../model/user");
const cloudinary = require("../../utils/cloudinaryConfig");

const EditProfile = wrapAsync(async (req, res) => {
  // console.log(req.body);
  let name = req.body.name;
  let updateData = { name: name };

  if (req.body.profile) {
    try {
      cloudinary.uploader.destroy(req.body.public_id);
      updateData.profile = req.body.profile;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to delete image, Try Again");
    }
  }

  if (req.body.removeImage == true) {
    try {
      await cloudinary.uploader.destroy(req.body.public_id);
      updateData.profile = {
        public_id: "",
        url: "",
      };
      //   console.log(result);
    } catch (error) {
      // console.log(error)
      throw new Error("Failed to delete image, Try Again");
    }
  }

  try {
    const user = await User.findByIdAndUpdate(req.body._id, updateData, {
      new: true,
    }).select("-password");
    res.json({
      success: true,
      message: user,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err,
    });
  }
});

module.exports = EditProfile;
