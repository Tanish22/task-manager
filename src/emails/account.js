const sgMail = require('@sendgrid/mail');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "tanishdeveloper22@gmail.com",
    subject: "Thanks for signing up !!",
    text: `Welcome to the Task App, ${name}`
  });
}

sendCancellationEmail = (email, name) => {
  sgMail.send({
    to : email,
    from : "tanishdeveloper22@gmail.com",
    subject : "Your account is deleted",
    text : `Let us know about the reasons for deleting the account Mr. ${name}. I hope to see you soon`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}