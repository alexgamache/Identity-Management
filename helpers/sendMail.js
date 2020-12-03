//send email here
//exports.sendMail = async function(email)

const nodemailer = require('nodemailer');

module.exports = Object.freeze({
  sendEmailNotification
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lexyptest@gmail.com',
    pass: 'lexypanQwer1234'
  }
});

async function sendEmailNotification(toEmail){

  const mailOptions = {
    from: 'lexyptest@gmail.com',
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