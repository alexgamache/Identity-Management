var canvas = require('canvas');
var faceapi = require('face-api.js')
var fs = require ('fs');
var monkey = require ('./monkeyPatch');
const Blob = require('node-fetch');

var model_url;

monkey.monkeyPatchFaceApiEnv();

let labeledFaceDescriptors = null;
let faceMatcher = null;





exports.checkFace = async (file, username) => {
	try {
		var user_dir = ('C:/Users/Dan/Documents/Senior_Capstone/back_end/Identity-Management/uploads/' + username + '/face/1.png')
		var stranger_dir = ('C:/Users/Dan/Documents/Senior_Capstone/back_end/Identity-Management/authentication/user.png')
		await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    	await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
    	await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
		const userFace = await canvas.loadImage(user_dir);
		const userDetections = await faceapi.detectSingleFace(userFace)
		.withFaceLandmarks().withFaceDescriptor()
		const faceMatcher = new faceapi.FaceMatcher(userDetections)
		faceMatcher._labeledDescriptors[0]._label = username;
		const strangerFace = await canvas.loadImage(stranger_dir);
		console.log('5')
		const strangerDetections = await faceapi.detectSingleFace(strangerFace)
		.withFaceLandmarks().withFaceDescriptor()
		const bestMatch = faceMatcher.findBestMatch(strangerDetections.descriptor)
		console.log(bestMatch._label);
		if(bestMatch._label == username) {
			return {
				status: 'success',
				message: 'good facial recognition'
			}
		} else {
			return {
				status: 'failure',
				message: 'bad facial recognition, try again'
			}
		}
	} catch(e) {
		console.log(e)

		return {
			status: 'error',
			message: e.message
		}
	}
}





exports.createFace = async (file, username) => {

	



	try {
		console.log('1')
		//loads the fastest possible facial detection models
		// await faceapi.nets.tinyFaceDetector.loadFromDisk('./models');
		await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');

		console.log('2')
		var img_dir = ('C:/Users/Dan/Documents/Senior_Capstone/back_end/Identity-Management/uploads/neckbeard/face/1.png')

		// await faceapi.bufferToImage() ????  //probably not nessecary
		console.log("3")
		faceDescription = await loadThisShit(img_dir);

		// try {
		// 	var faceModeling = await faceapi.detectSingleFace(image);
		// 	// var faceModeling = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions());
		// } catch (e) {
		// 	console.log("oh god oh fuck");
		// 	console.log(e)
		// }
		console.log("and the next one");
		

		// var finished = faceapi.LabeledFaceDescriptors(username, descriptor);


		faceMatcher = new faceapi.FaceMatcher(faceDescription, 0.6)

		return {
			status: 'success'
		}

	} catch(e) {
		console.log(e.message);
		return {
			status: 'error',
			message: e.message
		}
	}


}

var loadThisShit = async (img_dir) => {

			console.log('4');
		// console.log(img_dir);

			const image = await canvas.loadImage(img_dir);

			console.log(5);

			var detections = await faceapi.detectSingleFace(image)

			console.log(detections);

			console.log(6);

			const description = []
			description.push(faceModeling.descriptor);

			console.log(7)

			return new faceapi.LabeledFaceDescriptors('neckbeard', descriptor);

	


}
// const detections = await faea


exports.verifyFace = async() => {

}