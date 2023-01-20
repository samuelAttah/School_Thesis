const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Elmagnifico1995",
  host: "localhost",
  port: 5432,
  database: "thesis",
});

module.exports = pool;
