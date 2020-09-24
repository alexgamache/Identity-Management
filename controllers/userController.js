//userController
const userService = require('../services/userService')

exports.register = async function(req, res){
    try{
		const user = req.body.user
		if(!user){
			res.send({
				status: 400,
				message: "No user object specified"
			})
		}else{
			const registration = await userService.register(user)
			if(registration.status === "Good"){
				res.send({
					status: 200,
					message: registration.message,
					data: registration.token,
					userID: registration.userID
				})
			}else{
				res.send({
					status: 500,
					message: registration.message
				})
			}
		}
    }
    catch(err){
		res.send({
			status: 400,
			message: err.message
		})
    }
}

exports.manageStatus = async function(req, res){
	try{
		const task = req.body.task
		const user = req.body.id
		if(!task || !id){
			res.send({
				status: 400,
				message: "This endpoint requires both task and id. One of those were missing check data for what was received",
				data: req.body
			})
		}
		const result = await userService.lockAccount(user, task)
		if(result.status === "Done"){
			res.send({
				status: 200,
				message: result.message
			})
		}else{
			res.send({
				status: 400,
				message: result.message
			})
		}
	}
	catch(err){
		res.send({
			status: 400,
			message: err.message
		})
	}
}