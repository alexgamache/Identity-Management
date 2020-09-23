//DB
const mysql = require('serverless-mysql')({
    config: {
	host     : process.env.ENDPOINT,
	database : process.env.DATABASE,
	user     : process.env.USERNAME,
	password : process.env.PASSWORD
    }
})

exports.mysql = mysql
