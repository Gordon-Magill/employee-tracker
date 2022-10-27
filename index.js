// Set up environment variables from .env
require("dotenv").config();

// Import the three major custom classes
const Employees = require("./lib/Employees");
const Roles = require("./lib/Roles");
const Departments = require("./lib/Departments");

// Helper functions for menu operation and database closeout
const { getMenuOption, closeDB } = require("./src/helperFunctions");

// Initializing global objects
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
      console.log("\nGoodbye.\n");
      return;

    case "View all departments":
      DEPARTMENTS.showTable();
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
      await DEPARTMENTS.addNewDept();

      // Keeping DEPARTMENTS up to date with db content
      DEPARTMENTS.refreshDepartmentList();

      console.log("\nSUCCESS:\nSuccessfully wrote new deptartment to db.\n");
      cycleMenuOptions();
      break;

    case "Add role":
      // Create new role that can draw from existing departments
      await ROLES.addNewRole(DEPARTMENTS.getDepartmentList());

      // Keeping ROLES up to date with db content
      ROLES.refreshRoleList();

      console.log("\nSUCCESS:\nSuccessfully wrote new role to db.\n");
      cycleMenuOptions();
      break;

    case "Add employee":
      // Create new employee that can draw from existing roles
      await EMPLOYEES.addNewEmployee(ROLES.getRoleList());

      // Keeping EMPLOYEES up to date with db content
      EMPLOYEES.refreshEmployeeList();

      console.log("\nSUCCESS:\nSuccessfully wrote new employee to db.\n");
      cycleMenuOptions();
      break;

    case "Change employee role":
      // Update employee role based on available roles
      await EMPLOYEES.changeEmployeeRole(ROLES.getRoleList());

      // Keeping EMPLOYEES up to date with db content
      EMPLOYEES.refreshEmployeeList();

      console.log(
        "\nSUCCESS:\nSuccessfully wrote modified employee info to db.\n"
      );
      cycleMenuOptions();
      break;

    case "Change employee manager":
      await EMPLOYEES.changeEmployeeManager()
      EMPLOYEES.refreshEmployeeList();
      console.log(
        "\nSUCCESS:\nSuccessfully wrote modified employee manager to db.\n"
      );
      cycleMenuOptions();
      break;

    case "Remove employee":
      await EMPLOYEES.removeEmployee()
      EMPLOYEES.refreshEmployeeList();
      console.log(
        "\nSUCCESS:\nSuccessfully removed employee from db.\n"
      );
      cycleMenuOptions();
      break;
  }
}

// Start the program with some nice text introduction
console.clear();
console.log(`\nWelcome to the company CMS\n`);
cycleMenuOptions();
