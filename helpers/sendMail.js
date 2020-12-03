//send email here
const nodemailer = require('nodemailer');

//Use gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Lexyptest@gmail.com',
    pass: 'lexypanQwer1234'

  }
});

exports.sendMail = async function(toEmail){

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