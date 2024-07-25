const express = require("express");
const router = express.Router();
const registeredUser = require("../controller/userAuth/registeredUser");
const checkEmail = require("../controller/userAuth/checkEmail");
const checkPassword = require("../controller/userAuth/checkPassword");
const userDetails = require("../controller/userAuth/userDetails");
const logOut = require("../controller/userAuth/logout");
const EditProfile = require("../controller/userAuth/EditProfile");
const searchUser = require("../controller/SearchUser/searchuser");

router.post("/register",registeredUser);
router.post("/email",checkEmail);
router.post("/login",checkPassword);
router.post("/fetchuser",userDetails);
router.get("/logout",logOut);
router.patch("/editprofile",EditProfile);

// Search User
router.post("/searchuser",searchUser);


module.exports = router;