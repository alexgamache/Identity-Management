//userService
const sendMail = require('../helpers/sendMail').sendEmailNotification
var jwt = require('jsonwebtoken')
const imgur = require('imgur');
var facialRecognition = require('./facialRecognition')
var speechVerify = require('./speechVerify')


exports.register = async function(userObj){
    try{
		const mysql = require('../helpers/db').mysql

		const checkIfExists = await mysql.query("Select * from user where email = ?", [userObj.email])
		if(checkIfExists.length){
			 return {
				 status: "bad",
				 message: "User already exists",
				 token: null
			 }
		} else {
		    
			await mysql.query("insert into user (password, fname, lname, email, is_admin, username) Values(?,?,?,?,?,?)", [userObj.password, userObj.fname, userObj.lname, userObj.email, 0, userObj.username])
		}

		const dbObj = await mysql.query("select * from user where email = ?", [userObj.email])
	await mysql.end()
	
		const token = await jwt.sign({user: dbObj[0]}, process.env.SECRET);
		sendMail(userObj.email)
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


exports.lockAccount = async function(user, task){
	try{
		const mysql = require('../helpers/db').mysql
		if (task === "lock"){
			await mysql.query('update user set isLocked = ? where username = ?', [1, user])
		}else if(task === "unlock"){
			await mysql.query('update user set isLocked = ? where username = ?', [0, user])
		}else if(task === "grant"){
			await mysql.query('update user set is_admin = ? where username = ?', [1, user])
		}else if(task === "revoke"){
			await mysql.query('update user set is_admin = ? where username = ?', [0, user])
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
		await mysql.end()
		if(!checkIfExists.length){
			return {
				status: "error",
				message: "User not found"
			}
		}
		if(checkIfExists[0].password === pass && checkIfExists[0].isLocked === 0) {
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

exports.update = async function(id, userObj){
    try{
        const mysql = require('../helpers/db').mysql
        if (userObj.email){
            await mysql.query('update user set email = ? where id = ?', [userObj.email, id])
        }if(userObj.password){
            await mysql.query('update user set password = ? where id = ?', [userObj.password, id])
        }if(userObj.fname){
            await mysql.query('update user set fname = ? where id = ?', [userObj.fname, id])
        }if(userObj.lname){
            await mysql.query('update user set lname = ? where id = ?', [userObj.lname, id])
        }else{
            return {
                status :"error",
                message: "field not recognized"
            }
        }
        const dbObj = await mysql.query("select * from user where id = ?", [id])
        await mysql.end()
        return {
            status: "Done",
            message: `user account successfully updated`,
            user: dbObj
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
			if(type == "face") {
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
			} else if(type == "voice") {
				var voiceInput = await speechVerify.checkVoice(file, username);
				if(voiceInput.status === 'success') {
	            	return({
	                	status: 200,
	                	message: voiceInput.message,
	                	data: {
	                    	name: type
	                		}
	            		})
	            	} else {
	            		return {
	            			status: 500,
	            			message: voiceInput.message
	            		}
	            	}
			}
    
		}catch(err){

		return {
			status: "error",
			message: err.message
		}
	}
}

exports.voiceRecog = async function(file, username){
	let token = ""
	const mysql = require('../helpers/db').mysql
	let checkIfExists = await mysql.query("select * from user where username = ?", [username])
	await mysql.end()
	if(checkIfExists.length){
		token = await jwt.sign({user: checkIfExists[0]}, process.env.SECRET);
	}
}

exports.getUsers = async function(){
	try{
		const mysql = require('../helpers/db').mysql
		const query = await mysql.query('select * from user')
		await mysql.end()
		return {
			message: "users retreived successfully",
			data: query
		}
	}
	catch(err){
		return{
			message: err,
			data: null
		}
	}
}