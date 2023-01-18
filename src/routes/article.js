const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const {jwtConfig} = require("../config/config")
const {getAllArticles, getAticle} = require("../repository/index")

router.get("/", async(req,res) => {
  const {page} = req.query
  const perpage = 10
  const p = ((page || 1)  -1 ) * perpage

  const [articles, lastPage] = await getAllArticles(perpage, p)

  res.json({pageInfo : {perpage,lastPage,currentPage: page || 1}, articles})
})

router.get("/:id", async (req,res) => {
  const {id} = req.params

  const article = await getAticle(id)

  res.json(article)
})

router.post("/articles", (req,res) => {
  if(!req.cookies.jwt) {
    return res.json({message: "로그인 이후 글 쓰기가 가능합니다!"})
  }
  const {title, contents} = req.body

  if (!title || !contents) {
    return res.status(401).end()
  }

  connection.query(`insert into Minseok06_articles (title, contents) values ("${title}", "${contents}") ;`, () => {
    res.status(201).json({message: "작성 완료~!"})
  })
  
})

router.put("/:id", async (req,res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }

  const {id} = req.params
  
  const article = await getAticle(id)
    // const contents = req.body.contents || rows[0].contents
    // const title = req.body.title || rows[0].title
    // connection.query(`update Minseok06_articles set title = "${title}", contents = "${contents}" where id = ${id}`, () => {
    //   res.json({message: "수정완료;;"})

  // })
  
  // const isIdCorrect = user.id === post.user_id
  // if (!isIdCorrect) {
  //   return res.status(401).json({message: "권한 업똥!"})
  // }
  
})

router.delete("/articles/:id", (req,res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }
  const {id} = req.params


  connection.query(`delete from Minseok06_articles where id = ${id}`, () => {
    res.json({message: "삭 완"})
  })
  
  // const user = users.find(user => user.id === jwt.verify(req.cookies.jwt, jwtConfig.secretKey).id)
  // if (!isIdCorrect) {
  //   return res.status(401).json({message: "권한 업똥!"})
  // }
  // const isIdCorrect = user.id === post.user_id

})

module.exports = router