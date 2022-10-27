const { db, prompt } = require("../src/helperFunctions");

// Class to model db content about roles
class Roles {
  constructor() {
    this.roleList = null;
    this.refreshRoleList();
  }

  //   Basic getter
  getRoleList() {
    return this.roleList;
  }

  //   Update object with db content
  async refreshRoleList() {
    let roles = await db
      .promise()
      .query(
        "SELECT role.title AS 'Title', role.id AS 'Role ID', role.salary AS 'Salary', department.name AS 'Department' FROM role LEFT JOIN department ON role.department_id=department.id"
      );
    this.roleList = roles;
  }

  //   Render formatted table
  showTable() {
    this.refreshRoleList();
    console.table(this.roleList[0]);
    console.log("");
  }

  //   Inquirer prompt to define a new employee role type
  async addNewRole(depts) {
    // Get department names as potential homes for the role
    let deptList = depts[0].map((dept) => dept.Department);

    // Inquirer prompt questions
    let roleQuestions = [
      {
        type: "input",
        message: "New role title: ",
        name: "newRoleTitle",
      },
      {
        type: "input",
        message: "New role salary: ",
        name: "newRoleSalary",
      },
      {
        type: "list",
        message: "New role department: ",
        choices: deptList,
        name: "newRoleDept",
      },
    ];

    // Inquirer prompt
    const roleInfo = await prompt(roleQuestions);

    // Deriving db table indices based on responses
    let roleDept = deptList.indexOf(roleInfo.newRoleDept) + 1; //Offsetting index by 1 since SQL indexes at 1

    // Writing new role to db
    return db
      .promise()
      .query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [roleInfo.newRoleTitle, parseInt(roleInfo.newRoleSalary), roleDept]
      );
  }

  removeRole() {
    
  }
}

module.exports = Roles;
