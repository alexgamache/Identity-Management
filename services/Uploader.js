const util = require('util');
const multer = require('multer');


class Uploader {

	constructor() {
		const storageOptions = multer.diskStorage({
			destination: function(req, file, cb) {
				cb(null, '/dir/')
			},
			filename: function (req, file, cb) {
				cb(null, 'file')
			}
		})
		this.upload = multer({storage: storageOptions});
	}
	async startUpload(req, res) {

		try {
			const upload = util.promisify(this.upload.any());

			await upload(req, res);

		} catch(err) {
			res.send(JSON.stringify({
				status: 400,
				message: err.message
			}))
		}

		return res.json({fileUploaded: filename});
	}
}