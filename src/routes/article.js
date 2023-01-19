const express = require("express")
const router = express.Router()

const {getArticles,getArticle,postArticle,putArticle,deleteArticle} = require("../controller/article")


router.get("/", getArticles)

router.get("/:id", getArticle)

router.post("/articles", postArticle)

router.put("/:id", putArticle)

router.delete("/articles/:id", deleteArticle)

module.exports = router