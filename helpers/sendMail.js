//send email here
//exports.sendMail = async function(email)
const nodemailer = require('nodemailer');
var toEmail = 'lpan@oakland.com';
module.exports = Object.freeze({
  sendEmailNotification
});

//Use gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Lexyptest@gmail.com',
    pass: 'Qw12er34'
  }
});

function sendEmailNotification(userName){

  const mailOptions = { //Email template
    from: 'Lexyptest@gmail.com',
    to: toEmail,
    subject: 'Email Comfirmation',
    text: 'Thank you for registering our website!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error);
    }else{
      console.log('Email sent:' + info.response);
    }
  });
}