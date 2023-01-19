const {User} = require("../models/user")

const getUserByEmailAndPassword = async (email, password) => {
  const user = await User.findOne({where : {email, password}})
  return user
}

const getUserInfo = async (id) => {
  const infos = await User.findByPk(id, {attributes: ["name", "email"]})
  return infos
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
  createEmail
}