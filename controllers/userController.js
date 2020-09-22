//userController
const userService = require('../services/userService')

exports.register = function(req, res){
    console.log(req.body)
    res.send("Yeet")
}