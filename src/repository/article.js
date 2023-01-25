const {Article} = require("../models/article")

const getAllArticles = async (perpage, p) => {
  const {count, rows} = await Article.findAndCountAll({limit: perpage, offset: p,order: [["created_at", "DESC"]]})
  const lastPage = (count % perpage) === 0 ? count / perpage : parseInt(count / perpage) + 1
  return [lastPage,rows]
}

const getArticle = async (id) => {
  try {
    const article = await Article.findByPk(id)
    if (!article) {
      throw new Error("Not Found")
    }
    return article
  } catch (err) {
    console.error(err)
  }
}

const createArticle = async (id, title, contents) => {
  try{
    const post = await Article.create({user_id : id, title, contents})
    return post
  } catch (err) {
    console.error(err)
  }
}

const upadateMyArticle = async (id, title, contents) => {
  try {
    const post = await Article.update({title,contents}, {where: {id}})
    if(!post) {
      throw new Error("없음")
    }
  } catch (err) {
    console.error(err)
  }
}

const deleteMyArticle = async (id) => {
  try {
    const post = await Article.destroy({where: {id}})
    if(!post) {
      throw new Error("없음")
    }
  } catch (err) {
    console.error(err)
  }
}

const countUpdate = async (id, count)=> {
  return await Article.update({count:count+1},{where:{id}})
}

module.exports = {getAllArticles, getArticle, createArticle, upadateMyArticle, deleteMyArticle, countUpdate}