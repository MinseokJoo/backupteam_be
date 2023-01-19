const sequelize = require("../db/conn")
const {DataTypes} = require('sequelize')

const User = sequelize.define('users', {
  id : {
    type: DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement: true
  },
  name : DataTypes.STRING,
  email : DataTypes.STRING,
  password : DataTypes.STRING,
  created_at : DataTypes.DATE
},{
  timestamps: true,
  updatedAt: false,
  createdAt: "created_at"
}
);

module.exports = {User}