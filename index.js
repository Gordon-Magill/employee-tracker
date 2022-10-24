// For retrieving mysql password from .env
require("dotenv").config();

// Helper functions for each major operation
const {
  //   getRoles,
  //   setNewRole,
  getDepts,
  //   setNewDept,
  //   getEmployees,
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
      await getDepts();

      // For whatever reason if you don't force the code to pause (even for 1ms)
      // then inquirer will overwrite the terminal console logs...
      setTimeout(() => {
        cycleMenuOptions();
      }, 1);
      break;
    case "View all roles":
        setTimeout(() => {
            cycleMenuOptions();
          }, 1);
      break;
    case "View all employees":
        setTimeout(() => {
            cycleMenuOptions();
          }, 1);
      break;
    case "Add department":
        setTimeout(() => {
            cycleMenuOptions();
          }, 1);
      break;
    case "Add role":
        setTimeout(() => {
            cycleMenuOptions();
          }, 1);
      break;
    case "Add employee":
        setTimeout(() => {
            cycleMenuOptions();
          }, 1);
      break;
    case "Change employee role":
        setTimeout(() => {
            cycleMenuOptions();
          }, 1);
      break;
  }
}

// Start the program
cycleMenuOptions();
