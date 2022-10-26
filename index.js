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
      await addNewDept();
      console.log('\nSUCCESS:\nSuccessfully wrote new deptartment to db.\n')
      cycleMenuOptions();
      break;
    case "Add role":
      await addNewRole();
      console.log('\nSUCCESS:\nSuccessfully wrote new role to db.\n')
      cycleMenuOptions();
      break;
    case "Add employee":
      await addNewEmployee();
      console.log('\nSUCCESS:\nSuccessfully wrote new employee to db.\n')
      cycleMenuOptions();
      break;
    case "Change employee role":
      await changeEmployeeRole();
      console.log('\nSUCCESS:\nSuccessfully wrote modified employee info to db.\n')
      cycleMenuOptions();
      break;
  }
}

// function testFuncAsync() {
//   setTimeout(() => {
//     return ['abc',123]
//   },2000)
// }

// function testFuncSync() {
//   return ['abc',123]
// }

// function testFuncPromise() {
//   let myPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(['abc',123])
//     },2000)


//   })

//   return myPromise;
  
// };

// let returnValAsync = testFuncAsync()
// let returnValSync = testFuncSync()
// let returnValPromise = testFuncPromise()
// console.dir(returnValAsync)
// console.log(typeof returnValAsync)
// console.dir(returnValSync)
// console.log(typeof returnValSync)
// console.dir(returnValPromise)
// console.log(typeof returnValPromise)


// Start the program
cycleMenuOptions();
