//userController
const userService = require('../services/userService')

exports.register = async function(req, res){
    try{
		const user = req.body.user
		if(!user){
			res.send(JSON.stringify({
				status: 400,
				message: "No user object specified"
			}))
		}else{
			const registration = await userService.register(user)
			if(registration.status === "Good"){
				res.send(JSON.stringify({
					status: 200,
					message: registration.message,
					data: registration.token
				}))
			}else{
			res.send(JSON.stringify({
				status: 500,
				message: "There was an error registering this user"
			}))
			}
		}
    }
    catch(err){
		res.send(JSON.stringify({
			status: 400,
			message: err.message
		}))
    }
}


exports.manageStatus = async function(req, res){
	try{
		const task = req.body.task
		const user = req.body.id
		if(!task || !id){
			res.send(JSON.stringify({
				status: 400,
				message: "This endpoint requires both task and id. One of those were missing check data for what was received",
				data: req.body
			}))
		}
		const result = await userService.lockAccount(user, task)
		if(result.status === "Done"){
			res.send(JSON.stringify({
				status: 200,
				message: result.message
			}))
		}else{
			res.send(JSON.stringify({
				status: 400,
				message: result.message
			}))
		}
	}
	catch(err){
		res.send(JSON.stringify({
			status: 400,
			message: err.message
		}))
	}
}