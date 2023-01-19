const jwt = require("jsonwebtoken")
const {jwtConfig} = require("../config/config")
const {getUserByEmailAndPassword,getUserInfo,checkEmail, createEmail} = require("../repository/index")

const getUserInfos = async (req,res) => {
  if(!req.cookies.jwt) {
    return res.json({message: "로그인 후"})
  }
  const {id} = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

  const userInfo = await getUserInfo(id)
  res.json(userInfo)
}

const login = async (req,res) => {
  const {email, password}= req.body

    const user = await getUserByEmailAndPassword(email, password)
    if(!user) {
      return res.status(404).end()
    }
  
    res.cookie("jwt", jwt.sign({id: user.id}, jwtConfig.secretKey, jwtConfig.options))
    res.status(200).json({message:`${user.name}님 하이...`})

}

const logout = (req,res) => {
  res.clearCookie("jwt")
  res.end()
}

const signup = async (req,res) => {
  const {name, email, password} = req.body

  if (!email || !password || !name) {
    return res.status(401).json({message: "끝까지 입력하세요"})
  }
  
  const user = await checkEmail(email)
    if(user) {
      return res.status(401).json({message: "실패"})
    }
    await createEmail(name, email, password)
    res.json({message: "축하"})
}

module.exports = {
  getUserInfos,
  login,
  logout,
  signup
}