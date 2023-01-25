const {getAllArticles, getArticle, createArticle,upadateMyArticle,deleteMyArticle, countUpdate} = require("../repository/index")
const jwt = require("jsonwebtoken")
const {jwtConfig} = require("../config/config")

const getArticles = async(req,res) => {
  const {page} = req.query
  const perpage = 10
  const p = ((page || 1)  -1 ) * perpage

  const [lastPage, articles] = await getAllArticles(perpage, p)

  res.json({pageInfo : {perpage,lastPage,currentPage: page || 1}, articles})
}

const OneArticle = async (req,res) => {
  const {id} = req.params

  const article = await getArticle(id)

  if(!article) {
    return res.status(404).json({message: "없음"})
  }

  await countUpdate(id, article.count)

  res.json(article)
}

const postArticle = async (req,res) => {
  if(!req.cookies.jwt) {
    return res.json({message: "로그인 이후 글 쓰기가 가능합니다!"})
  }
  const {id} = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)
  const {title, contents} = req.body

  await createArticle(id,title,contents)
  res.status(201).json({message: "작성 완료~!"})
}

const putArticle = async (req,res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }

  const {id} = req.params
  
  const article = await getArticle(id)

  if(!article) {
    return res.status(401).json({message: "없음"})
  }

  if (article.user_id !== jwt.verify(req.cookies.jwt, jwtConfig.secretKey)) {
    return res.json({hhh: "노권한"})
  }

  const contents = req.body.contents || article.contents

  const title = req.body.title || article.title

  await upadateMyArticle(id,title,contents)

  res.json({message: "수정완료;;"})
}

const deleteArticle = async (req,res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({message : "로그인 이후 가능"})
  }
  const {id} = req.params

  const {id: user_id} = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)

  const article = await getArticle(id)

  if(!article) {
    return res.status(404).json({message: "없음"})
  }

  const isIdCorrect = article.user_id === user_id

  if (!isIdCorrect) {
    return res.status(401).json({message: "권한 업똥!"})
  }

  await deleteMyArticle(article.id)
  res.json({message: "삭완"})
}

module.exports = {
  getArticles,
  OneArticle,
  postArticle,
  putArticle,
  deleteArticle
}