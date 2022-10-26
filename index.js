// For retrieving mysql info from .env
require("dotenv").config();

const Employees = require("./lib/Employees");
const Roles = require('./lib/Roles')
const Departments = require('./lib/Departments')
// Helper functions for each major operation
const {
  // getRoles,
  // addNewRole,
  // showRoles,
  // getDepts,
  // showDepts,
  // addNewDept,
  // getEmployees,
  // showEmployees,
  // addNewEmployee,
  getMenuOption,
  changeEmployeeRole,
  closeDB,
} = require("./src/helperFunctions");

// Initializing objects
let EMPLOYEES = new Employees();
let DEPARTMENTS = new Departments();
let ROLES = new Roles();

// Continuously loops through options until the user elects to exit the program
async function cycleMenuOptions() {

  // At the beginning of the loop, ask the user to select an option
  let option = await getMenuOption();

  // Take action based on the user input
  switch (option) {

    // Special case to close the DB connection at the end and terminate the menu loop
    case "Quit":
      closeDB();
      console.log('\nGoodbye.\n')
      return;

    case "View all departments":
      DEPARTMENTS.showTable()
      cycleMenuOptions();
      break;

    case "View all roles":
      ROLES.showTable();
      cycleMenuOptions();
      break;

    case "View all employees":
      EMPLOYEES.showTable();
      cycleMenuOptions();
      break;

    case "Add department":
      await DEPARTMENTS.addNewDept()
      DEPARTMENTS.refreshDepartmentList()
      console.log("\nSUCCESS:\nSuccessfully wrote new deptartment to db.\n");
      cycleMenuOptions();
      break;

    case "Add role":
      await ROLES.addNewRole(DEPARTMENTS.getDepartmentList());
      ROLES.refreshRoleList()
      console.log("\nSUCCESS:\nSuccessfully wrote new role to db.\n");
      cycleMenuOptions();
      break;

    case "Add employee":
      await EMPLOYEES.addNewEmployee(ROLES.getRoleList())
      EMPLOYEES.refreshEmployeeList()
      console.log("\nSUCCESS:\nSuccessfully wrote new employee to db.\n");
      cycleMenuOptions();
      break;

    case "Change employee role":
      await EMPLOYEES.changeEmployeeRole(ROLES.getRoleList())
      EMPLOYEES.refreshEmployeeList()
      console.log(
        "\nSUCCESS:\nSuccessfully wrote modified employee info to db.\n"
      );
      cycleMenuOptions();
      break;
  };
};




// Start the program with some nice text introduction
console.clear()
console.log(`\nWelcome to the company CMS\n`)
cycleMenuOptions();