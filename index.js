// For retrieving mysql password from .env
require("dotenv").config();

// Helper functions for each major operation
const {
  getRoles,
  addNewRole,
  showRoles,
  getDepts,
  showDepts,
  addNewDept,
  getEmployees,
  showEmployees,
  addNewEmployee,
  getMenuOption,
  changeEmployeeRole,
  closeDB,
} = require("./src/helperFunctions");

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
      const depts = await getDepts();
      showDepts(depts[0]);
      cycleMenuOptions();
      break;

    case "View all roles":
      let roles = await getRoles();
      showRoles(roles[0]);
      cycleMenuOptions();
      break;

    case "View all employees":
      let employees = await getEmployees();
      showEmployees(employees[0]);
      cycleMenuOptions();
      break;

    case "Add department":
      await addNewDept();
      console.log("\nSUCCESS:\nSuccessfully wrote new deptartment to db.\n");
      cycleMenuOptions();
      break;

    case "Add role":
      await addNewRole();
      console.log("\nSUCCESS:\nSuccessfully wrote new role to db.\n");
      cycleMenuOptions();
      break;

    case "Add employee":
      await addNewEmployee();
      console.log("\nSUCCESS:\nSuccessfully wrote new employee to db.\n");
      cycleMenuOptions();
      break;

    case "Change employee role":
      await changeEmployeeRole();
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