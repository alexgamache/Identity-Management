//userController
const userService = require('../services/userService')
// const Uploader = require('../services/Uploader.js')


exports.register = async function(req, res){
    try{
    	console.log("registration attempt");
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
exports.login = async function(req, res){
	let username = req.body.username
	let pass = req.body.password

	if(!username || !pass){
		res.send({
			status: 400,
			message: "Username and password are required"
		})
	}
	let result = await userService.login(username, pass)
	if(result.status === "error"){
		res.send({
			status: 401,
			message: result.message
		})
	}
	else {
		res.send({
			status: 200,
			message: result.message
		})
	}
}





exports.upload = async (req, res) => {
    try {
    	let file = req.files.file;
    	let type = req.body.type;
    	let username = req.body.username;
    	let method = req.body.method;
    	console.log(req.files);
        if(!req.files) {
        	console.log("no file upload");
            res.send({
                status: 400,
                message: 'No file was uploaded!'     
            });
        } else {
        	if(method == 'create') {
        		const creating = await userService.create(file, type, username);
	 			if(creating.status === 200) {
	 				res.send({
	 					status: 200,
	 					data: req.body.username,
	 					message: creating.message
	 				})
	 			} else {
	 				console.log("userservice 500")
	 				res.send({
	 					status: 500,
	 					message: creating.message
	 				})
	 			}
        	} 
        	else if(method == 'authenticate') {
        		const authenticating = await userService.authenticate(file, type, username);
	 			if(authenticating.status === 200) {
	 				res.send({
	 					status: 200,
	 					data: req.body.username,
	 					message: authenticating.message
	 				})
	 			} else {
	 				res.send({
	 					status: 500,
	 					message: authenticating.message
	 				})
	 			}
        	}	
        }
    } catch (err) {
        res.send({
        	status: 400,
        	message: err.message
        });
    }
};



