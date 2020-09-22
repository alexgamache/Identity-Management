const express = require('express')
const app = express()
const port = 80

const example = require('./controllers/example')

app.get('/', example.test)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
