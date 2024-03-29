//index.js
//Basic server setup
require('@tensorflow/tfjs-node');
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const fs = require('fs');
const port = 80
const fileUpload = require('express-fileupload');
const auth = require("./helpers/token")

//Import controllers here
const example = require('./controllers/example')
const user = require('./controllers/userController')

//add middleware here
app.use(async function (req, res, next) {

  if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === "/upload") {
    return next();
  }
  else{
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No credentials sent! Send Jwt in authorization' });
    }
    else{
      let isAuthorized = await auth.verify(req.headers.authorization)
      if(isAuthorized){
        return next()
      }
      else{
        return res.status(401).json({ error: 'Not Authorized' });
      }
    }
  }
})

app.use(bodyParser.json())
app.use(fileUpload({
	createParentPath: true,
	saveFileNames: true,
	preserveExtension: true
}));

//link endpoints to controller functions here
app.get('/', example.test)
app.post('/register', user.register)
app.post('/manage', user.manageStatus)
app.post('/upload', user.upload)
app.post('/update', user.update)
app.post('/login', user.login)
app.post('/voice', user.voice)
app.get('/users', user.getUsers)

//listen on the url
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
