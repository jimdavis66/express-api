const config = {
  database: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'expressDemo'
  },
  server: {
    host: 'localhost',
    port: 3000
  },
  jwt: {
    secretkey: 'secretKey'
  }
};

module.exports = config;
