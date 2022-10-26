const { db, prompt } = require("../src/helperFunctions");

class Departments {
  constructor() {
    this.departmentList = null;
    this.refreshDepartmentList();
  }

  getDepartmentList() {
    return this.departmentList;
  }

  async refreshDepartmentList() {
    let depts = await db
      .promise()
      .query(
        "SELECT name AS 'Department', id AS 'Department ID' FROM department;"
      );
    this.departmentList = depts;
  };

  showTable() {
    this.refreshDepartmentList()
    console.table(this.departmentList[0])
    console.log("");
  }

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
      .query(
        "INSERT INTO department (name) VALUES (?);",
        deptInfo.newDeptName
      );
  }
  
}

module.exports = Departments;