//Basic server setup
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 80
var multer = require('multer');
const fileUpload = require('express-fileupload');

//Import controllers here
const example = require('./controllers/example')
const user = require('./controllers/userController')

app.use(bodyParser.json())
app.use(fileUpload({
	createParentPath: true
}));

//link endpoints to controller functions here
app.get('/', example.test)
app.post('/register', user.register)
app.post('/manage', user.manageStatus)
app.post('/upload', user.upload);


//listen on the url
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




