const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "freebody123",
  database: "shop",
  host: "localhost",
  port: 5432,
});

module.exports = pool;
