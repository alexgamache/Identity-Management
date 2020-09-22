const exampleService = require('../services/example-service')
//Do web stuff here (interact with res/req import and excecute services)
exports.test = function (req, res){
    res.send(exampleService.greeting());
}
