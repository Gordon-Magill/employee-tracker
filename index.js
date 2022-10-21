const inquirer = require('inquirer')
const db = require('mysql2')
const {
    getRoles,
    setNewRole,
    getDepts,
    setNewDept,
    getEmployees,
    setNewEmployee,
    getMenuOption
  } = require('./src/helperFunctions')

// For retrieving mysql password
require('dotenv').config()

db.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PW,
    database: 'company_db'
})

while (true) {
    let menuOption = getMenuOption()

    switch (menuOption) {
        case "View all departments":
            await getDepts()
            break;
        case "View all roles":
            await getRoles()
            break;
        case "View all employees":
            await getEmployees()
            break;
        case "Add department":
            await setNewDept()
            break;
        case "Add role":
            await setNewRole()
            break;
        case "Add employee":
            await setNewEmployee()
            break;
        case "Change employee role":
            // await changeEmployee()
            break;
    }

    await menuOption



        
}



// Present initial options to user