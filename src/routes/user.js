const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const {jwtConfig} = require("../config/config")
const {getUserByEmailAndPassword,getUserInfo} = require("../repository/index")

router.get("/userInfos", async (req,res) => {
  if(!req.cookies.jwt) {
    return res.json({message: "로그인 후"})
  }
  const {id} = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

  const userInfo = await getUserInfo(id)
  res.json(userInfo)
})

router.post("/login", async (req,res) => {
  const {email, password}= req.body

    const user = await getUserByEmailAndPassword(email, password)
    if(!user) {
      return res.status(404).end()
    }
  
    res.cookie("jwt", jwt.sign({id: user.id}, jwtConfig.secretKey, jwtConfig.options))
    res.status(200).json({message:`${user.name}님 하이...`})

})

router.get("/logout", (req,res) => {
  res.clearCookie("jwt")
  res.end()
})

router.post("/signup", async (req,res) => {
  const {name, email, password} = req.body

  if (!email || !password || !name) {
    return res.status(401).json({message: "끝까지 입력하세요"})
  }
  
  const user = await getUserByEmailAndPassword(email)
    if(user[0]) {
      return res.status(401).json({message: "실패"})
    }
    res.json({message: "조금만 기다려바 곧 해줄게..."})
    // connection.query(`insert into Minseok_users (name, email, password) values ("${name}", "${email}", "${password}");`)
    // res.json({message: "축하"})

})

module.exports = router
