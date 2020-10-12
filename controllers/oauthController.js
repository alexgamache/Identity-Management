//oauthController

exports.callback = function (req, res) {
    try {
        const user = req.user.displayName
        if(!user){
			res.send({
				status: 400,
				message: "No user object specified"
			})
        }
        else {
            res.send({
				status: 200,
				message: req.user.displayName
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

exports.fail = function (req, res) {
    res.send('Login failed.')
}