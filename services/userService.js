//userService
const mysql = require('../helpers/db').mysql
var jwt = require('jsonwebtoken')

exports.register = async function(userObj){
    try{
	await mysql.query("insert into user (fname, lname, email, is_admin) Values(?,?,?,?)", [userObj.fname, userObj.lname, userObj.email, 0])
	const dbObj = await mysql.query("select * from user where email = ?", [userObj.email])
	await mysql.end()
	const token = await jwt.sign(dbObj[0], process.env.SECRET);
	return {
	    status: "Good",
	    message: "user registered successfully",
	    token: token
	}
    }
    catch(err){
	return {
	    status: "bad",
	    message: err.message,
	    token: null
	}
    }
}
