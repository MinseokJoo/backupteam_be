const sequelize = require("../db/conn")
const {DataTypes} = require("sequelize")

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

module.exports = {Article}