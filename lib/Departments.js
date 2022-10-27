const { db, prompt } = require("../src/helperFunctions");

// Class to model db content about departments
class Departments {
  constructor() {
    this.departmentList = null;
    this.refreshDepartmentList();
  }

  // Basic getter for core property information
  getDepartmentList() {
    return this.departmentList;
  }

  // Update object with latest db content
  async refreshDepartmentList() {
    let depts = await db
      .promise()
      .query(
        "SELECT name AS 'Department', id AS 'Department ID' FROM department;"
      );
    this.departmentList = depts;
  }

  // Render formatted table of departments
  showTable() {
    this.refreshDepartmentList();
    console.table(this.departmentList[0]);
    console.log("");
  }

  // Inquirer prompt to get a new department definition
  async addNewDept() {

    // Get the new dept name from the user
    const deptInfo = await prompt({
      type: "input",
      message: "New dept name: ",
      name: "newDeptName",
    });

    // Insert the new department
    return db
      .promise()
      .query("INSERT INTO department (name) VALUES (?);", deptInfo.newDeptName);
  }

  // Handles SQL queries needed to delete a department from its table
  async removeDept() {
    // Get department name strings
    let deptNames = this.departmentList[0].map((dept) => dept.Department);

    // Inquirer question to get department to delete
    const deptPicker = await prompt({
      type: "list",
      message: "Select department to remove:",
      choices: deptNames,
      name: "selectedDept",
    });

    // Getting department ID from the index of the selected option
    let deptIndex = deptNames.indexOf(deptPicker.selectedDept);
    let deptId = this.departmentList[0][deptIndex]["Department ID"];

    // Actually deleting the department from its table
    return db.promise().query(`DELETE FROM department WHERE id=?`, deptId);
  }

  //
  async displayDeptCost() {
    // Get department name strings
    let deptNames = this.departmentList[0].map((dept) => dept.Department);

    // Inquirer question to get department to summarize
    const deptPicker = await prompt({
      type: "list",
      message: "Select department to get utilized budget from:",
      choices: deptNames,
      name: "selectedDept",
    });

    // Get department ID from the index of the selected option
    let deptIndex = deptNames.indexOf(deptPicker.selectedDept);
    let deptId = this.departmentList[0][deptIndex]["Department ID"];

    // Get the department employees
    // Just copying a previous query since it has the correct information
    let deptEmployees = await db.promise().query(
      `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
                FROM employee copy1
                LEFT JOIN role ON copy1.role_id=role.id 
                LEFT JOIN department ON role.department_id=department.id
                LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id
                WHERE department.id=?`,
      deptId
    );

    // Cycle through all the employees and sum their salaries
    let budgetSum = 0;
    deptEmployees[0].forEach((emp) => {
      budgetSum += parseInt(emp.Salary);
    });

    // Log the accumulated salary total
    console.log(`Budget for ${deptPicker.selectedDept}:\n\t$${budgetSum}/yr\n`);
  }
}

module.exports = Departments;
