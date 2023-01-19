const {findOne, findByPk} = require("../repository/db")

const getUserByEmailAndPassword = async (email, password) => {
  password = !password ? null : password
  if (!password) {
    return await findOne("users", [{email}])
  }
  return await findOne('users', [{email, password}])
}

const getUserInfo = async (id) => {
  return await findByPk("users", {id})
}

module.exports = {
  getUserByEmailAndPassword,
  getUserInfo
}