//userService
const sendmail = require('../helpers/sendMail').sendMail
var jwt = require('jsonwebtoken')
var facialRecognition = require('./facialRecognition')



exports.register = async function(userObj){
    try{
		const mysql = require('../helpers/db').mysql
		await mysql.query("insert into user (password, fname, lname, email, is_admin, username) Values(?,?,?,?,?,?)", [userObj.password, userObj.fname, userObj.lname, userObj.email, 0, userObj.username])


		const checkIfExists = await mysql.query("Select * from user where email = ?", [userObj.email])
		if(checkIfExists.length){
			 return {
				 status: "bad",
				 message: "User already exists",
				 token: null
			 }
		} else {
			await mysql.query("insert into user (fname, lname, email, is_admin) Values(?,?,?,?)", [userObj.fname, userObj.lname, userObj.email, 0])
		}

		const dbObj = await mysql.query("select * from user where email = ?", [userObj.email])
		await mysql.end()
		const token = await jwt.sign({user: dbObj[0]}, 'secret');
		// const token = await jwt.sign({user: dbObj[0]}, process.env.SECRET);
		// await sendmail(userObj.email)
		return {
			status: "Good",
			message: "user registered successfully",
			token: token,
			userID: dbObj[0].id 
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


exports.lockAccount = async function(id, task){
	try{
		const mysql = require('../helpers/db').mysql
		if (task === "lock"){
			await mysql.query('update user set isLocked = ? where id = ?', [1, id])
		}else if(task === "unlock"){
			await mysql.query('update user set isLocked = ? where id = ?', [0, id])
		}else{
			return {
				status :"error",
				message: "task not recognized"
			}
		}
		await mysql.end()
		return {
			status: "Done",
			message: `user account successfully ${task}ed`
		}
	}
	catch(err){
		return {
			status: "error",
			message: err.message
		}
	}
}

exports.login = async function(user, pass){
	try{
		const mysql = require('../helpers/db').mysql
		let checkIfExists = await mysql.query("select * from user where username = ?", [user])
		if(!checkIfExists.length){
			return {
				status: "error",
				message: "User not found"
			}
		}
		if(checkIfExists[0].password === pass){
			const token = await jwt.sign({user: checkIfExists[0]}, process.env.SECRET);
			return {
				status: "good",
				message: token,
				userID: checkIfExists[0].id
			}
		}
		else{
			return{
				status: "error",
				message: "Unauthorised"
			}
		}
	}
	catch(err){
		return {
			status: "error",
			message: err.message
		}
	}

}

exports.create = async function(file, type, username){
	console.log(username);
	try{
			const filename = file.name;
			const extension = filename.substring(filename.lastIndexOf("."));
            file.mv('./uploads/' + username + '/' + type + '/1' + extension);
            return({
                status: 200,
                message: 'The file was uloaded sucessfuly!',
                data: {
                    name: type
                }
            });
	}
	catch(err){
		return {
			status: "error",
			message:err.message
		}
	}
}



exports.authenticate = async function(file, type, username){
	try{
			const filename = file.name;
			const extension = filename.substring(filename.lastIndexOf("."));
			file.mv('./authentication/1' + extension)
			var faceInput = await facialRecognition.checkFace(file, username);
            if(faceInput.status === 'success') {
            	return({
                	status: 200,
                	message: faceInput.message,
                	data: {
                    	name: type
                		}
            		})
            	} else {
            		return {
            			status: 500,
            			message: faceInput.message
            		}
            	}
		}catch(err){

		return {
			status: "error",
			message: err.message
		}
	}
}

