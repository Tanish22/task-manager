const sgMail = require('@sendgrid/mail');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "tnsh.gupte@gmail.com",
  from: "tanishdeveloper22@gmail.com",
  subject: "My first shot at sendgrid !!",
  text: "Congrats for having done it successfully !!",
};

//  sgMail.send(msg);

const sendSGMail = async (mssg) => {
  try{
     await sgMail.send(mssg);
  }
  catch(error){
    console.log('error', error);
    
  }
}
sendSGMail(msg)