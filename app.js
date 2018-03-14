const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'wordpressA'
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// initialise app
const app = express();

// logging middleware
app.use(morgan('dev'));

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.get('/users', (req, res, next) => {
  con.query('select * from wp_users', (err, result, fields) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/terms', (req, res, next) => {
  con.query('select * from wp_terms', (err, result, fields) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
