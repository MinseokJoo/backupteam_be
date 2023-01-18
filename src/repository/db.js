let conn
require("./conn").then((a) => {
  conn = a
})



const findOne = async (table, [conditions]) => {
  let conditionString
  if([conditions].length <= 1){
    conditionString = Object.keys(conditions).map(field => `${field} = ?`).join(" and ")
  } else {
    conditionString = Object.keys(conditions)
  }
  const [result] = await conn.execute(`select * from ${table} where ${conditionString}`,Object.values(conditions))
  return result[0]
}

const findByPk = async (table, condition) => {
  const key = Object.key || "id"
  const [rows] = await conn.execute(`select * from ${table} where ${key} = ?`, Object.values(condition))
  if(!rows[0]) {
    throw new Error("Not Found")
  }
  return rows[0]
}

const findAndCountAll = async (table, info) => {
  const [count] = await conn.execute(`select count(*) from  ${table}`)
  lastPage =  (count[0]["count(*)"] % info.perpage) === 0 ? count[0]["count(*)"] / info.perpage : parseInt(count[0]["count(*)"] / info.perpage) + 1
  const [rows] = await conn.execute(`select * from ${table} order by id desc limit ? offset ?`, Object.values(info))
  return [rows, lastPage]
}



module.exports = {findOne, findByPk, findAndCountAll}