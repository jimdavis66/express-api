const mysql = require('mysql');
const config = require('../config');

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

module.exports = con;
