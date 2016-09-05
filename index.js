var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

app.set('email_host', process.env.EMAIL_HOST);
app.set('email_from', process.env.EMAIL_FROM);
app.set('email_pass', process.env.EMAIL_PASS);
app.set('email_to', process.env.EMAIL_TO);

if (app.get('email_host') && app.get('email_from') && app.get('email_pass')){
  var smtpConfig = {
    host: app.get('email_host'),
    port: 465,
    secure: true,
    auth: {
      user: app.get('email_from'),
      pass: app.get('email_pass')
    }
  };
  var transporter = nodemailer.createTransport(smtpConfig);
} else {
  console.log("Warning: Email not configured");
}

app.set('port', (process.env.PORT || 8080));

app.set('views', './views')
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

function routePage(page){
  app.get('/' + page, function (req, res) {
    res.render(page);
  });
}

var pages = ['empty', 'code', 'contact', 'math'];

for (var i = 0; i < pages.length; i++){
  routePage(pages[i]);
}

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/contact', function (req, res) {
  console.log('Message send request:');
  console.log(req.body);
  sendContact(req.body, function (results){
    res.render('contact', {error: results.error, message: results.message, orig: req.body});
  });
});

app.use(express.static('./static'));

app.use(function (req, res){
  console.log("404 Page Not Found: " + req.method + " " + req.url);
  res.status(404);
  res.render('404');
});

app.listen(app.get('port'), function () {
  console.log('Listening on port ' + app.get('port') + '!');
});

function sendContact(obj, cb){
  if (!transporter || !app.get('email_to')){
    console.log("Error: Email not configured");
    cb({error: true, message: "Email not configured."});
    return;
  }
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
  
  var mailOptions = {
    from: obj.name + ' <' + app.get('email_from') + '>',
    replyTo: obj.name + ' <' + obj.email + '>',
    to: app.get('email_to'),
    subject: "Contact: " + obj.subject,
    text: "From: " + obj.name + ' <' + obj.email + '>\n\n' + obj.message
  };
  console.log('Sending message:');
  console.log(mailOptions);
  
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
