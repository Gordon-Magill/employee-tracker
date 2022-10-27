const { db, prompt } = require("../src/helperFunctions");

// Class to model db content about departments
class Departments {
  constructor() {
    this.departmentList = null;
    this.refreshDepartmentList();
  }

  //   Basic getter
  getDepartmentList() {
    return this.departmentList;
  }

  //   Update object with db content
  async refreshDepartmentList() {
    let depts = await db
      .promise()
      .query(
        "SELECT name AS 'Department', id AS 'Department ID' FROM department;"
      );
    this.departmentList = depts;
  }

  //   Render formatted table
  showTable() {
    this.refreshDepartmentList();
    console.table(this.departmentList[0]);
    console.log("");
  }

  //   Inquirer prompt to get a new department definition
  async addNewDept() {
    let deptQuestions = [
      {
        type: "input",
        message: "New dept name: ",
        name: "newDeptName",
      },
    ];
    const deptInfo = await prompt(deptQuestions);

    return db
      .promise()
      .query("INSERT INTO department (name) VALUES (?);", deptInfo.newDeptName);
  }

  async removeDept() {
    // Get employee name strings
    let deptNames = this.departmentList[0].map(dept => dept.Department);

    // Inquirer question to get employee to change
    const deptPicker = await prompt({
      type: "list",
      message: "Select department to remove:",
      choices: deptNames,
      name: "selectedDept",
    });

    let deptIndex = deptNames.indexOf(deptPicker.selectedDept);
    let deptId = this.departmentList[0][deptIndex]['Department ID']

    return db
      .promise()
      .query(`DELETE FROM department WHERE id=?`, 
      deptId
      );
  }

  async displayDeptCost() {
    // Get employee name strings
    let deptNames = this.departmentList[0].map(dept => dept.Department);

    // Inquirer question to get employee to change
    const deptPicker = await prompt({
      type: "list",
      message: "Select department to get utilized budget from:",
      choices: deptNames,
      name: "selectedDept",
    });

    let deptIndex = deptNames.indexOf(deptPicker.selectedDept) + 1;
    
    let deptEmployees = await db.promise().query(
      `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
                FROM employee copy1
                LEFT JOIN role ON copy1.role_id=role.id 
                LEFT JOIN department ON role.department_id=department.id
                LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id
                WHERE department.id=?`,
                deptIndex
    );
    // console.dir(deptEmployees)

    let budgetSum = 0;
    deptEmployees[0].forEach(emp => {
      budgetSum += parseInt(emp.Salary)
    })

    console.log(`Budget for ${deptPicker.selectedDept}:\n\t$${budgetSum}/yr\n`)


  }
}

module.exports = Departments;
