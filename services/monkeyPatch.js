var canvas = require('canvas');
// import fetch from 'node-fetch';
var fetch = require('node-fetch');
// import * as faceapi from 'face-api.js'
var faceapi = require('face-api.js')
// export const monkeyPatchFaceApiEnv


exports.monkeyPatchFaceApiEnv = () => {
    const { Canvas, Image, ImageData } = canvas;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    faceapi.env.monkeyPatch({ fetch: fetch });
}