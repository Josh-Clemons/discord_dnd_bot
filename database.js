const { Pool } = require('pg');
const {databaseURL} = require('./config.json')

const pool = new Pool({
    connectionString: databaseURL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = pool;
