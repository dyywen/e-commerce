const express = require('express')
require('dotenv').config()
// require('./Database/connection')
const bodyParser = require('body-parser')
const usersRouter = require('./routes/user')

const app = express()
const port = process.env.PORT



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/users', usersRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})