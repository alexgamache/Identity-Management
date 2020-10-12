//index.js
//Basic server setup
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 80
const multer = require('multer');
const fileUpload = require('express-fileupload');

const passport = require('passport');
require('./passport-setup');

//Import controllers here
const example = require('./controllers/example')
const user = require('./controllers/userController')
const google = require('./controllers/oauthController')

//add middleware here
app.use(bodyParser.json())
app.use(fileUpload({
  createParentPath: true
}));

app.use(passport.initialize());
app.use(passport.session());

//link endpoints to controller functions here
app.get('/', example.test)
app.post('/register', user.register)
app.post('/manage', user.manageStatus)
app.post('/upload', user.upload)
app.post('/login', user.login)

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), google.callback)

app.get('/failed', google.fail)

//listen on the url
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
