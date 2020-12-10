const imgur = require('imgur');
imgur.setClientId(process.env.IMGUR_CLIENTID);

exports.upload = async function upload(file, albumId){
    let response;
    imgur.uploadFile(file, albumId)
    .then(function (json) {
        response = json.data
    })
    .catch(function (err) {
        console.error(err.message);
    });
    return response
    //There is no download method. keep the link somehwere safe
}

exports.createAlbum = async function createAlbum(){
    let response = await imgur.createAlbum()
    return response
}