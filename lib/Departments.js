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

  }

  displayDeptCost() {

  }
}

module.exports = Departments;
