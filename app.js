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

let corsOptions = {
  origin: 'http://localhost:5100',
  credentials: true
}

const app = express()

app.use(express.json(), cookieParser(),cors(corsOptions))

app.get("/articles", (req,res) => {
  res.json(articles)
})

app.post("/articles", (req,res) => {
  if(!req.cookies.jwt) {
    return res.json({message: "로그인 이후 글 쓰기가 가능합니다!"})
  }
  const {title, contents} = req.body
  const created_at = new Date()

  if (!title || !contents) {
    return res.status(401).end()
  }


  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  
  const maxObjArr = articles.reduce( (prev, value) => {
    return prev.guildMemberCount >= value.guildMemberCount ? prev : value
  });

  articles.push({id : maxObjArr.id + 1,title, contents, user_id: user.id,created_at,count:0 })

  res.json({message: "게시글을 작성했습니다."})
})

app.get("/articles/:id", (req,res) => {
  const {id} = req.params

  const post = articles.find(art => art.id == id)
  if (!post) {
    return res.status(404).end()
  }

  res.json(post)
})

app.put("/articles/:id", (req,res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }

  const {id} = req.params
  const post = articles.find(art => art.id == id)

  if(!post) {
    return res.json({message: "게시물 조회에 실패했습니다."})
  }

  const contents = req.body.contents || post.contents
  const title = req.body.title || post.title

  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  const isIdCorrect = user.id === post.user_id


  if (!isIdCorrect) {
    return res.status(401).json({message: "권한 업똥!"})
  }

  post.contents = contents
  post.title = title

  res.json({message: "수정완료;;"})
})

app.delete("/articles/:id", (req,res) => {
  const {id} = req.params

  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }
  
  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  const post = articles.find(art => art.id == id)

  const isIdCorrect = user.id === post.user_id


  if(!post) {
    return res.json({message: "게시물 조회에 실패했습니다."})
  }

  if (!isIdCorrect) {
    return res.status(401).json({message: "권한 업똥!"})
  }

  const index = articles.findIndex(po => po.id === post.id)
  articles.splice(index, 1)
  res.json({message: "삭 완"})
})

app.get("/userInfos", (req,res) => {
  const userId = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

  const info = users.find(user => user.email === userId.email)
  const myposts = articles.filter(art => art.user_id === info.id)

  if(!info) {
    return res.status(401).json({msg: "진짜 누구세요??"})
  }

  res.json({info, myposts})
})

app.post("/signup", (req,res) => {
  const {email, password, name} = req.body

  if (!email || !password || name) {
    return res.end()
  }
  
  const user = users.find(user => user.email === email)

  if(user) {
    return res.json({message: "이미 가입한 이메일 입니다."})
  } else {
    const maxObjArr = users.reduce( (prev, value) => {
      return prev.guildMemberCount >= value.guildMemberCount ? prev : value
    });
    console.log(maxObjArr.id)

    users.push({id: maxObjArr.id + 1, name, email, password, created_at: new Date()})
    return res.json({message: "회원가입 축하다"})
  }
})

app.post("/login", (req,res) => {
  const {email, password}= req.body

  const user = users.find(user => user.email === email && user.password === password)

  if(!user) {
    return res.status(401).end()
  }

  res.cookie("jwt", jwt.sign(user, jwtConfig.secretKey, jwtConfig.options))
  res.status(200).json({msg:`${user.name}님 환영합니다`})
})

app.get("/logout", (req,res) => {
  res.clearCookie("jwt")
  res.end()
})

app.listen(5000,() => console.log(5000,"번 서버 열림"))