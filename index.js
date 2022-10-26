// For retrieving mysql password from .env
require("dotenv").config();

// Helper functions for each major operation
const {
  getRoles,
  //   setNewRole,
  showRoles,
  getDepts,
  showDepts,
  setNewDept,
  getEmployees,
  showEmployees,
  //   setNewEmployee,
  getMenuOption,
  //   changeEmployee,
  db,
  closeDB,
} = require("./src/helperFunctions");

// Continuously loops through options until the user elects to exit the program
async function cycleMenuOptions() {
  let option = await getMenuOption();

  switch (option) {
    case "Quit":
      closeDB();
      console.log("Done cycling options");
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
      showEmployees(employees[0])

      cycleMenuOptions();

      break;
    case "Add department":
      await setNewDept();
      setTimeout(() => {
        cycleMenuOptions();
      }, 50);
      break;
    case "Add role":
      await setNewRole();
      setTimeout(() => {
        cycleMenuOptions();
      }, 50);
      break;
    case "Add employee":
      setTimeout(() => {
        cycleMenuOptions();
      }, 50);
      break;
    case "Change employee role":
      setTimeout(() => {
        cycleMenuOptions();
      }, 50);
      break;
  }
}

// Start the program
cycleMenuOptions();
