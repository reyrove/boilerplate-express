require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

console.log('Hello World');

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Root-level logger middleware
app.use(function(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Serve static assets from /public
app.use('/public', express.static(__dirname + '/public'));

// Serve index.html on root path
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// /now route with chained middleware to add time and respond with it
app.get('/now', function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.json({ time: req.time });
});

// Echo route to respond with JSON echo of the route param word
app.get('/:word/echo', function(req, res) {
  let word = req.params.word;
  res.json({ echo: word });
});

// /name GET route to respond with concatenated first and last names from query params
app.get('/name', function(req, res) {
  const first = req.query.first || '';
  const last = req.query.last || '';
  res.json({ name: `${first} ${last}`.trim() });
});

// /name POST route to respond with concatenated first and last names from request body
app.post('/name', function(req, res) {
  const first = req.body.first || '';
  const last = req.body.last || '';
  res.json({ name: `${first} ${last}`.trim() });
});

// Serve JSON on /json route with conditional uppercase message
app.get('/json', function(req, res) {
  let message = 'Hello json';
  if (process.env.MESSAGE_STYLE === 'uppercase') {
    message = message.toUpperCase();
  }
  res.json({ message: message });
});

module.exports = app;
