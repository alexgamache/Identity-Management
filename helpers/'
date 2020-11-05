//used to manage and verify tokens
const jwt = require('jsonwebtoken')


exports.verify = async function(token){
    try{
        await jwt.verify(token, process.env.SECRET);
        return true
    }
    catch(err){
	console.log(err);
        return false
    }
}
