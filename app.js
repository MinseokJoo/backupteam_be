const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const users = require("./db/users")
const articles = require("./db/articles")

const jwtConfig = {
  secretKey : "a",
  options: {
    algorithm: "HS256",
    expiresIn: "30m",
    issuer: "wnalstjr"
  }
}

const app = express()

let corsOptions = {
  origin: 'http://localhost:5100',
  credentials: true
}

app.use(express.json(), cookieParser(),cors(corsOptions))

app.get("/articles", (req,res) => {
  res.json(articles)
})

app.post("/articles", (req,res) => {
  const {title, contents} = req.body
  const created_at = new Date()

  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  users.push({id : users.length+1,title, contents, user_id: user.id,created_at,count:0 })

  res.send(users)
})

app.get("/articles/:id", (req,res) => {
  const {id} = req.params

  const post = articles.find(art => art.id == id)
  console.log(post)
  if (!post) {
    return res.json({message: "게시물 조회에 실패하였습니다."})
  }

  res.send(post)
})

app.delete("/articles/:id", (req,res) => {
  const {id} = req.params
  
  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  const post = articles.find(art => art.id == id)

  const isIdCorrect = user.id === post.id


  if(!post) {
    return res.json({message: "게시물 조회에 실패했습니다."})
  }

  if (!isIdCorrect) {
    return res.status(401).json({message: "권한 업똥!"})
  }

  articles[post.id - 1] = {}

  res.send(articles)
})

app.put("/articles/:id", (req,res) => {
  const {id} = req.params
  const {contents} = req.body
  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  const post = articles.find(art => art.id == id)

  const isIdCorrect = user.id === post.id


  if(!post) {
    return res.json({message: "게시물 조회에 실패했습니다."})
  }

  if (!isIdCorrect) {
    return res.status(401).json({message: "권한 업똥!"})
  }

  post.contents = contents

  return res.send(post)

})

app.get("/userInfos", (req,res) => {
  const userId = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

  const info = users.find(user => user.email === userId.email)
  const myposts = articles.find(art => art.user_id === info.id)

  if(!info) {
    return res.status(401).json({msg: "진짜 누구세요??"})
  }
  const mylist = Object.assign(info, myposts)

  res.json(mylist)
})

app.post("/login", (req,res) => {
  const {email, password}= req.body

  const user = users.find(user => user.email === email && user.password === password)

  if(!user) {
    return res.status(401).send("누구세요?")
  }

  res.cookie("jwt", jwt.sign(user, jwtConfig.secretKey, jwtConfig.options))
  console.log(req.cookies)
  res.status(200).json({msg:`${user.name}님 환영합니다`})
})

app.listen(5000,() => console.log(5000,"번 서버 열림"))