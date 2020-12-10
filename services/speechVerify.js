"use strict";

var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");

const profile_locale = "en-us";



// const passphrase_files = ["boi1.wav", "boi1.wav"] ;
// const verify_file = "myVoiceIsMyPassportVerifyMe02.wav";

const key_var = '7a74676786174cedaf9b33dbc90cb108';
// if (!process.env[key_var]) {
//     throw new Error('please set/export the following environment variable: ' + key_var);
// }
// var subscription_key = process.env[key_var];
var subscription_key = key_var;

const region_var = 'westus';
// if (!process.env[region_var]) {
//     throw new Error('please set/export the following environment variable: ' + region_var);
// }
// var region = process.env[region_var];
var region = region_var;

const ticks_per_second = 10000000;

function GetAudioConfigFromFile (file)
{
    let pushStream = sdk.AudioInputStream.createPushStream();
    fs.createReadStream(file).on("data", function(arrayBuffer) {
        pushStream.write(arrayBuffer.buffer);
    }).on("end", function() {
        pushStream.close();
    });
    return sdk.AudioConfig.fromStreamInput(pushStream);
}

async function TextDependentVerification(client, speech_config, passphrase_files, verify_file)
{
    console.log ("Text Dependent Verification:\n");
    var profile = null;
    try {
        // Create the profile.
        profile = await new Promise ((resolve, reject) => {
            client.createProfileAsync (sdk.VoiceProfileType.TextDependentVerification, profile_locale, result => { resolve(result); }, error => { reject(error); });
        });
        console.log ("Created profile ID: " + profile.profileId);
        await AddEnrollmentsToTextDependentProfile(client, profile, passphrase_files);
        const audio_config = GetAudioConfigFromFile(verify_file);
        const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
        const score = await SpeakerVerify(profile, recognizer);
        return score;
    }
    catch (error) {
        console.log ("Error:\n" + error);
    }
    finally {
        if (profile !== null) {
            console.log ("Deleting profile ID: " + profile.profileId);
            await new Promise ((resolve, reject) => {
                client.deleteProfileAsync (profile, result => { resolve(result); }, error => { reject(error); });
            });
        }
    }
}

async function AddEnrollmentsToTextDependentProfile(client, profile, audio_files)
{
    for (var i = 0; i < audio_files.length; i++) {
        console.log ("Adding enrollment to text dependent profile...");
        const audio_config = GetAudioConfigFromFile (audio_files[i]);
        console.log("got the audio config");
        const result = await new Promise ((resolve, reject) => {
            client.enrollProfileAsync (profile, audio_config, result => { resolve(result); }, error => { reject(error); });
        });
        if (result.reason === sdk.ResultReason.Canceled) {
        	console.log("cancelled");
        	console.log(result);
        	console.log(result.reason)
            throw(JSON.stringify(sdk.VoiceProfileEnrollmentCancellationDetails.fromResult(result)));
        }
        else {
            console.log ("Remaining enrollments needed: " + result.privDetails["remainingEnrollmentsCount"] + ".");
        }
    };
    console.log ("Enrollment completed.\n");
}

async function SpeakerVerify(profile, recognizer)
{
    const model = sdk.SpeakerVerificationModel.fromProfile(profile);
    const result = await new Promise ((resolve, reject) => {
        recognizer.recognizeOnceAsync (model, result => { resolve(result); }, error => { reject(error); });
    });
    console.log ("Verified voice profile for speaker: " + result.profileId + ". Score is: " + result.score + ".\n");
    return result.score;
}

// async function main() {
//     const speech_config = sdk.SpeechConfig.fromSubscription(subscription_key, region);
//     const client = new sdk.VoiceProfileClient(speech_config);

//     await TextDependentVerification(client, speech_config);
//     console.log ("End of quickstart.");
// }
// main();


exports.checkVoice = async(file, username) =>{
	try {

		const strangerFilename = file.name;
		const strangerExtension = await strangerFilename.substring(strangerFilename.lastIndexOf("."));
		var files = fs.readdirSync(process.env.LOCAL_DIR + 'uploads/' + username + '/voice/');
		const userFilename = files[0];
		const userExtension = userFilename.substring(userFilename.lastIndexOf("."));
		var user_dir = (process.env.LOCAL_DIR + 'uploads/' + username + '/voice/1' + userExtension)
		var stranger_dir = (process.env.LOCAL_DIR + 'authentication/1' + strangerExtension)

		const passphrase_files = [user_dir, user_dir, user_dir];
		const verify_file = stranger_dir;
		const speech_config = sdk.SpeechConfig.fromSubscription(subscription_key, region);
	    const client = new sdk.VoiceProfileClient(speech_config);

	    const score = await TextDependentVerification(client, speech_config, passphrase_files, verify_file);

	    if(score >= 0.65) {
	    	return {
	    		status: 'success',
	    		message: 'good voice recognition'
	    	} 
	    } else {
	    	return {
	    		status: 'failure',
	    		message: 'bad voice recognition, try again'
	    	}
	    }
	} catch(e) {
		return {
			status: 'error',
			message: e.message
		}
	}
}

