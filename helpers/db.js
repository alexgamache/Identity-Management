//DB connector
const mysql = require('serverless-mysql')({
  config: {
	  host     : 'localhost',
	  database : 'capstone',
	  user     : 'root',
	  password : ''
	  	}
})

exports.mysql = mysql
