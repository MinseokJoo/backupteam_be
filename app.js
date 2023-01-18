const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {corsOptions} = require("./src/config/config")
const articleRouter = require('./src/routes/article')
const userRouter = require('./src/routes/user')

const app = express()

app.use(express.json(), cookieParser(),cors(corsOptions))

app.use("/articles", articleRouter)
app.use(userRouter)

app.listen(5000,() => console.log(5000,"번 서버 열림"))