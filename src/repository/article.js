const {findByPk, findAndCountAll} = require("../repository/db")

const getAllArticles = async (perpage, p) => {
  return await findAndCountAll("articles", {perpage, p})
}

const getAticle = async (id) => {
  return await findByPk("articles", {id})
}

module.exports = {getAllArticles, getAticle}