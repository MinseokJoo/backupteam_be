const {User} = require("../models/user")
const {Article} = require("../models/article")

const getUserByEmailAndPassword = async (email, password) => {
  const user = await User.findOne({where : {email, password}})
  return user
}

const getUserInfo = async (id) => {
  const infos = await User.findByPk(id, {attributes: ["name", "email"]})
  return infos
}

const myposts = async (id) => {
  const myArticles = await Article.findAll({ where : {user_id :id} , limit:5, order: [["id", "DESC"]]})
  return myArticles
}

const checkEmail = async(email) => {
  const isAlreadyEmail = await User.findOne({where : {email}})
  return isAlreadyEmail
}

const createEmail = async (name,email,password) => {
  const signupIsOkay = await User.create({name,email,password})
  return signupIsOkay
}

module.exports = {
  getUserByEmailAndPassword,
  getUserInfo,
  checkEmail,
  createEmail,
  myposts
}