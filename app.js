const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const mysql = require("mysql")

const connection = mysql.createConnection({
  host: "caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com",
  user: "sparta",
  password: "tmvkfmxk2022",
  database: "sparta_backup"
})

connection.connect()

let corsOptions = {
  origin: 'http://localhost:5100',
  credentials: true
}

const jwtConfig = {
  secretKey : "a",
  options: {
    algorithm: "HS256",
    expiresIn: "30m",
    issuer: "wnalstjr"
  }
}

const app = express()

app.use(express.json(), cookieParser(),cors(corsOptions))

app.get("/articles", (req,res) => {
  const {page} = req.query
  const b = 10
  const a = ((page || 1)  -1 ) * b

  connection.query(`select * from Minseok06_articles order by id desc limit ${b} offset ${a}`, (error, rows, fields) => {
    res.json(rows)
  })
})

app.post("/articles", (req,res) => {
  if(!req.cookies.jwt) {
    return res.json({message: "로그인 이후 글 쓰기가 가능합니다!"})
  }
  const {title, contents} = req.body

  if (!title || !contents) {
    return res.status(401).end()
  }
  // const id = jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id

  // connection.query(`select * from Minseok_users where id = "${id}"`, (error, rows, fields) => {
  // })

  connection.query(`insert into Minseok06_articles (title, contents) values ("${title}", "${contents}") ;`, () => {
    res.status(201).json({message: "작성 완료~!"})
  })
  
})

app.get("/articles/:id", (req,res) => {
  const {id} = req.params

  connection.query(`select * from Minseok06_articles where id = ${id}`, (error, rows, fields) => {
    if (!rows) {
      return res.status(404).end()
    }
  
    res.json(rows[0])
  })
})

app.put("/articles/:id", (req,res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }

  const {id} = req.params
  
  connection.query(`select * from Minseok06_articles where id = ${id}`, (error, rows, fields) => {
    const contents = req.body.contents || rows[0].contents
    const title = req.body.title || rows[0].title
    connection.query(`update Minseok06_articles set title = "${title}", contents = "${contents}" where id = ${id}`, () => {
      res.json({message: "수정완료;;"})
    })
  })
  
  // const isIdCorrect = user.id === post.user_id
  // if (!isIdCorrect) {
  //   return res.status(401).json({message: "권한 업똥!"})
  // }
  
})

app.delete("/articles/:id", (req,res) => {
  const {id} = req.params

  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }

  connection.query(`delete from Minseok06_articles where id = ${id}`, () => {
    res.json({message: "삭 완"})
  })
  
  // const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)
  // if (!isIdCorrect) {
  //   return res.status(401).json({message: "권한 업똥!"})
  // }
  // const isIdCorrect = user.id === post.user_id

})

app.get("/userInfos", (req,res) => {
  const id = jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id

  // const info = users.find(user => user.email === userId.email)
  connection.query(`select name, email from Minseok_users where id = ${id};`, (error,rows,fields) => {
    res.json(rows[0])
  })
})

app.post("/signup", (req,res) => {
  const {name, email, password} = req.body

  if (!email || !password || !name) {
    return res.status(401).json({message: "끝까지 입력하세요"})
  }
  
  connection.query(`select * from Minseok_users where email = "${email}"`, (error, rows, fields) => {
    if(rows[0]) {
      return res.status(401).json({message: "실패"})
    }
    connection.query(`insert into Minseok_users (name, email, password) values ("${name}", "${email}", "${password}");`)
    res.json({message: "축하"})
  })
})

app.post("/login", (req,res) => {
  const {email, password}= req.body

  connection.query(`select * from Minseok_users where email = "${email}" and password = "${password}";`, (error, rows, fields) => {
    if(!rows[0]) {
      return res.status(401).json({message: "실패"})
    }
  
    res.cookie("jwt", jwt.sign({id: rows[0].id}, jwtConfig.secretKey, jwtConfig.options))
    res.status(200).json(`${rows[0].name}님 하이...`)
  })
})

app.get("/logout", (req,res) => {
  res.clearCookie("jwt")
  res.end()
})

app.listen(5000,() => console.log(5000,"번 서버 열림"))