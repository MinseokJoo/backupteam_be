const {Sequelize} = require("sequelize")

let sequelize
try {
  sequelize = new Sequelize('sparta_backup', 'sparta', 'tmvkfmxk2022', {
    host: 'caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com',
    dialect: "mysql"
  });
  console.log("DB 연결 완료~!")
} catch (err) {
  console.log(err)
}


module.exports = sequelize