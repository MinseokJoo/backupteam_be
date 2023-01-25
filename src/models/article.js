const sequelize = require("../db/conn")
const {DataTypes} = require("sequelize")
const {User} = require("./user")

const Article = sequelize.define("articles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: DataTypes.STRING,
  contents: DataTypes.STRING,
  count: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE
},{
  timestamps: true,
  updatedAt: false,
  createdAt: "created_at"
}
)

Article.User = Article.belongsTo(User, {foreignKey: "user_id"})
User.Article = User.hasMany(Article, {foreignKey: "user_id"})

module.exports = {Article}