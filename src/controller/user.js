const jwt = require("jsonwebtoken")
const {jwtConfig} = require("../config/config")
const {getUserByEmailAndPassword,getUserInfo,checkEmail, createEmail,myposts} = require("../repository/index")

const getUserInfos = async (req,res) => {
  if(!req.cookies.jwt) {
    return res.json({message: "로그인 후"})
  }
  const {id} = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

  const userInfo = await getUserInfo(id)
  const myArticles = await myposts(id)
  res.json({userInfo, myArticles})
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
  const {name, email, password, confirm} = req.body
  
  if(password !== confirm) {
    return res.status(500).json({notSame: "비밀번호가 다름"})
  }
  
  const user = await checkEmail(email)
  if(user) {
    return res.status(401).json({alreadyEmail: "이미 가입된 이메일 입니다."})
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