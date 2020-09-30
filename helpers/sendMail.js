//send email here
//exports.sendMail = async function(email)

const nodemailer = require('nodemailer');
var toEmail = 'someone@yahoo.com';
module.exports = Object.freeze({
  sendEmailNotification
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xxxx@gmail.com',
    pass: 'yyyy'
  }
});

function sendEmailNotification(userName){

  const mailOptions = {
    from: 'xxxx@gmail.com',
    to: toEmail,
    subject: 'Email Verification',
    text: `Thank you for registering our website!`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error);
    }else{
      console.log('Email sent:' + info.response);
    }
  });
}