/* Load libraries */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compositions = require("./compositions.json");
var sendContact = require('./contact.js');

/* Define variables */

app.set('port', process.env.PORT || 8080);
app.set('hostname', process.env.HOSTNAME || undefined);
app.set('views', __dirname + '/views')
app.set('view engine', 'pug');

/* Route for index */

app.get('/', function (req, res) {
  res.render('index');
});

/* Route for most pages */

function routePage(page, data){
  app.get('/' + page, function (req, res) {
    res.render(page, data);
  });
}

var pages = ['empty', 'code', 'contact', 'math', 'articles', 'articles/property-based'];

pages.forEach(function (page){
  routePage(page);
});

/* Route for music */

routePage('music', {compositions: compositions});

/* Route for construction pages */

function constructionPage(page, title){
  app.get('/' + page, function (req, res) {
    console.log('Construction page: /' + page + ' ' + title);
    res.render('construction', {title: title});
  });
}

var constructions = [];

constructions.forEach(function (page){
  constructionPage(page[0], page[1]);
});

/* Route for contact page */

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/contact', function (req, res) {
  console.log('Message send request:');
  console.log(req.body);
  sendContact(req.body, function (results){
    res.render('contact', {error: results.error, message: results.message, orig: req.body});
  });
});

/* Route for static pages */

app.use(express.static(__dirname + '/static'));

/* Route for 404 */

app.use(function (req, res){
  console.log("404 Page Not Found: " + req.method + " " + req.url);
  res.status(404);
  res.render('404');
});

/* Listen on port or export app */

if (require.main === module){
  app.listen(app.get('port'), app.get('hostname'), function () {
    console.log('Listening on port ' + app.get('port') + '!');
  });
} else {
  module.exports = app;
}

