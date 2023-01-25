const express = require("express")
const router = express.Router()

const {getArticles,OneArticle,postArticle,putArticle,deleteArticle} = require("../controller/article")


router.get("/", getArticles)

router.get("/:id", OneArticle)

router.post("/", postArticle)

router.put("/:id", putArticle)

router.delete("/:id", deleteArticle)

module.exports = router