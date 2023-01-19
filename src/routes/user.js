const express = require("express")
const router = express.Router()
const {getUserInfos,login,logout,signup} = require("../controller/user")


router.get("/userInfos", getUserInfos)

router.post("/login", login)

router.get("/logout", logout)

router.post("/signup", signup)

module.exports = router
