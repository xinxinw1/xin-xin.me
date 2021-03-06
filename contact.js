var nodemailer = require('nodemailer');

/* Get email config */

var email;
try {
  email = require('./email-config.json');
} catch (e){
  console.log("Warning: Email not configured");
}

/* If email is configured, create transporter */

var transporter;
if (email) {
  if (email.smtpConfig && email.from && email.to){
    var transporter = nodemailer.createTransport(email.smtpConfig);
  } else {
    console.log("Warning: Email file not valid");
  }
}

function sendContact(obj, cb){
  // check if email is configured
  if (!transporter || !email || !email.from || !email.to){
    console.log("Error: Email not configured");
    cb({error: true, message: "Email not configured."});
    return;
  }
  
  // validate input
  var items = [obj.name, obj.email, obj.subject, obj.message];
  var fns = [validName, validEmail, validSubject, validMessage];
  var messages = ["Invalid name.", "Invalid email.", "Invalid subject.", "Invalid message."];
  for (var i = 0; i < items.length; i++){
    if (!fns[i](items[i])){
      console.log("Error: " + messages[i]);
      cb({error: true, message: messages[i]});
      return;
    }
  }
  
  // set up message
  var mailOptions = {
    from: obj.name + ' <' + email.from + '>',
    replyTo: obj.name + ' <' + obj.email + '>',
    to: email.to,
    subject: "Contact: " + obj.subject,
    text: "From: " + obj.name + ' <' + obj.email + '>\n\n' + obj.message
  };
  console.log('Sending message:');
  console.log(mailOptions);
  
  // send message
  transporter.sendMail(mailOptions, function (error, info){
    if (error){
      console.log('Message failed to send:');
      console.log(error);
      cb({error: true, message: String(error)});
      return;
    }
    console.log('Message sent:');
    console.log(info);
    cb({message: "Message sent sucessfully!"});
  });
}

/* Validator functions */

function validName(a){
  return /^[^<>]+$/.test(a);
}

function validEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validSubject(a){
  return /^.+$/.test(a);
}

function validMessage(a){
  return /^.+$/.test(a);
}

/* Export */

module.exports = sendContact;
