var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8080));

app.set('views', './views')
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.get('/code', function (req, res) {
  res.render('code', { title: 'Code', message: 'Hello there!'});
});

app.use(express.static('./static'));

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!');
});

