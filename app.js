const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const camelcaseKeys = require('camelcase-keys');
const config = require('./config');
const con = require('./lib/db');

// initialise app
const app = express();

// load middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.get('/students', auth, (req, res, next) => {
  jwt.verify(req.token, config.jwt.secretkey, (err, authData) => {
    if (err) {
      res.status(401).send(err);
    } else {
      // Authorise user
      if(!authData.user.roles.includes(req.path.toString())){
        res.status(403).send('You are not authorised to access this API');
      } else {

        con.query('select * from students', (err, result, fields) => {
          if (err) res.status(500).send(err);
          res.json(camelcaseKeys(result));
          //res.send(result[0].FULL_NAME);
        });
      }
    }
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
      res.json(camelcaseKeys(result));
    }
  });
});

app.get('/api', auth, (req, res, next) => {
  // Authenticate user
  jwt.verify(req.token, config.jwt.secretkey, (err, authData) => {
    if (err) {
      res.status(401).send(err);
    } else {
      // Authorise user
      if(!authData.user.roles.includes(req.path.toString())){
        res.status(403).send('You are not authorised to access this API');
      } else {
        res.json({
          message: 'You\'ve made it to the protected area...',
          authData
        });
      }
    }
  });
});


app.post('/api/login', (req, res, next) => {
  // Mock user to be stored in a DB somewhere
  const user = {
    id: 1,
    username: 'james',
    email: 'james@gmail.com',
    roles: [
      'admin',
      '/api',
      '/students'
    ],
    permissions: [
      'read',
      'write',
      'delete'
    ]
  }
  // Generate a signed token
  jwt.sign({user: user}, config.jwt.secretkey, (err, token) => {
    console.log(token);
    res.json({
      token
    });
  });
});

// Verify token for authentication

// Format of token
// Authorization: Bearer <access_token>
function auth(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at space character to extract <access_token>
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // Check if they are authorised to access this req.path
    console.log(req.path.toString());
    // look up their permissions from the db

    // Next middleware
    next();
  } else {
    // Forbidden
    res.status(403).send('You do not have access');
  }
}

app.listen(config.server.port, () => {
  console.log(`Server is listening on port ${config.server.port}`);
});
