const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const users = require("./db/users")
let articles = require("./db/articles")

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

app.get("/users", (req,res) => {
  res.json(users)
})

app.get("/articles", (req,res) => {
  res.json(articles)
})

app.post("/articles", (req,res) => {
  const {title, contents} = req.body
  const created_at = new Date()

  if(!req.cookies.jwt) {
    return res.json({message: "로그인 이후 글 쓰기가 가능합니다!"})
  }

  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  
  const maxObjArr = articles.reduce( (prev, value) => {
    return prev.guildMemberCount >= value.guildMemberCount ? prev : value
  });
  console.log(maxObjArr.id)

  articles.push({id : maxObjArr.id + 1,title, contents, user_id: user.id,created_at,count:0 })

  res.json({message: "게시글을 작성했습니다."})
})

app.get("/articles/:id", (req,res) => {
  const {id} = req.params

  const post = articles.find(art => art.id == id)
  console.log(post)
  if (!post) {
    return res.json({message: "게시물 조회에 실패하였습니다."})
  }

  res.json(post)
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

  const del_articles = articles.filter(art => art.id !== post.id)

  articles = del_articles

  res.json({message: "삭제 완료"})
})

app.put("/articles/:id", (req,res) => {
  const {id} = req.params
  const post = articles.find(art => art.id == id)
  console.log(post)
  const contents = req.body.contents || post.contents
  const title = req.body.title || post.title
  const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)

  const isIdCorrect = user.id === post.id

  if(!post) {
    return res.json({message: "게시물 조회에 실패했습니다."})
  }

  if (!isIdCorrect) {
    return res.status(401).json({message: "권한 업똥!"})
  }

  post.contents = contents
  post.title = title

  return res.json({message: "수정완료;;"})

})

app.get("/userInfos", (req,res) => {
  const userId = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

  const info = users.find(user => user.email === userId.email)
  const myposts = articles.filter(art => art.user_id === info.id)

  if(!info) {
    return res.status(401).json({msg: "진짜 누구세요??"})
  }
  // const mylist = Object.assign(info, myposts)

  res.json({info, myposts})
})

app.post("/signup", (req,res) => {
  const {email, password, name} = req.body
  
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
    return res.status(401).send("누구세요?")
  }

  res.cookie("jwt", jwt.sign(user, jwtConfig.secretKey, jwtConfig.options))
  res.status(200).json({msg:`${user.name}님 환영합니다`})
})

app.get("/logout", (req,res) => {
  res.clearCookie("jwt")
  res.end()
})

app.listen(5000,() => console.log(5000,"번 서버 열림"))