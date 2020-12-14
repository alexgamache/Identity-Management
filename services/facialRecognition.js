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
		const strangerFilename = file.name;
		console.log(strangerFilename)
		const strangerExtension = await strangerFilename.substring(strangerFilename.lastIndexOf("."));
		var files = fs.readdirSync(process.env.LOCAL_DIR + 'uploads/' + username + '/face/');
		const userFilename = files[0]
		console.log(userFilename);
		console.log(userFilename);
		const userExtension = userFilename.substring(userFilename.lastIndexOf("."));
		var user_dir = (process.env.LOCAL_DIR + 'uploads/' + username + '/face/1' + userExtension)
		var stranger_dir = (process.env.LOCAL_DIR + 'authentication/1' + strangerExtension)
		await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    	await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
    	await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
		const userFace = await canvas.loadImage(user_dir);
		const userDetections = await faceapi.detectSingleFace(userFace)
		.withFaceLandmarks().withFaceDescriptor()
		const faceMatcher = new faceapi.FaceMatcher(userDetections)
		faceMatcher._labeledDescriptors[0]._label = username;
		const strangerFace = await canvas.loadImage(stranger_dir);
		const strangerDetections = await faceapi.detectSingleFace(strangerFace)
		.withFaceLandmarks().withFaceDescriptor()
		const bestMatch = faceMatcher.findBestMatch(strangerDetections.descriptor)
		if(bestMatch._label == username) {
			console.log("good facial recognition");
			return {
				status: 'success',
				message: 'good facial recognition'
			}
		} else {
			console.log("bad facial recognition");
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

