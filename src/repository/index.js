const user = require("../controller/user")
const article = require("../controller/article")

module.exports = {
  ...user,
  ...article
}