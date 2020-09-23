require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 80

const example = require('./controllers/example')
const user = require('./controllers/userController')

app.use(bodyParser.json())
app.get('/', example.test)
app.post('/register', user.register)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
