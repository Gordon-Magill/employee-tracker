const inquirer = require('inquirer')
const db = require('mysql2')

// For retrieving mysql password
require('dotenv').config()

db.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PW,
    database: 'company_db'
})


// Present initial options to user