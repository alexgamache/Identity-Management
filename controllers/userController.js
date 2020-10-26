//userController
const userService = require('../services/userService')
// const Uploader = require('../services/Uploader.js')


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
			message: result.message,
			userID: result.userID
		})
	}
}

exports.upload = async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file was uploaded!'
            });
        } else {
 
            let face = req.files.face;
            

            face.mv('./uploads/' + face.name);

            res.send({
                status: true,
                message: 'The file was uloaded sucessfuly!',
                data: {
                    name: face.name,
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};