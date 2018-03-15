const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql');
const camelcaseKeys = require('camelcase-keys');
const config = require('./config');
const con = require('./lib/db');

// initialise app
const app = express();

// logging middleware
app.use(morgan('dev'));

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.get('/students', (req, res, next) => {
  con.query('select * from students', (err, result, fields) => {
    if (err) res.status(500).send(err);
    res.send(camelcaseKeys(result));
    //res.send(result[0].FULL_NAME);
  });
});

app.get('/students/:contactId', (req, res, next) => {
  var contactId = req.params.contactId;
  con.query(`select * from students where CONTACT_ID=${contactId}`, (err, result, fields) => {
    if (err) res.status(500).send(err);
    if (result.length < 1) {
      //result not found
      res.status(404).send(`${req.path} not found`);
    } else {
      res.send(camelcaseKeys(result));
    }
  });
});

app.listen(config.server.port, () => {
  console.log(`Server is listening on port ${config.server.port}`);
});
