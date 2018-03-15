const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql');
const config = require('./config');

var con;
var db_config = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
};

function handleDisconnect() {
  con = mysql.createConnection(db_config);

  con.connect(function(err) {
    if(err) {
      console.log('Error connecting to DB');
      setTimeout(handleDisconnect, 2000);
    }
  });

  con.on('error', function(err) {
    console.log('Database error: err');
    if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

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
    if (err) {
      if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        handleDisconnect();
      } else {
        throw err;
      }
    } else {
      res.send(result);
    }
  });
});

app.get('/terms', (req, res, next) => {
  con.query('select * from wp_terms', (err, result, fields) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(config.server.port, () => {
  console.log(`Server is listening on port ${config.server.port}`);
});
