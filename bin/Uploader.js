Class Uploader {
	constructor(dir, file) {
		var storageOptions = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, dir)
			},
			filename: function (req, file, cb) {
				cb(null, file)
			}
		})
	this.upload = multer({storage: storageOptions});
	}
}