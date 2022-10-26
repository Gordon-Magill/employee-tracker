const { db, prompt } = require("../src/helperFunctions");

class Roles {
  constructor() {
    this.roleList = null;
    this.refreshRoleList();
  }

  getRoleList() {
    return this.roleList
  }

  async refreshRoleList() {
    let roles = await db
      .promise()
      .query(
        "SELECT role.title AS 'Title', role.id AS 'Role ID', role.salary AS 'Salary', department.name AS 'Department' FROM role LEFT JOIN department ON role.department_id=department.id"
      );
    this.roleList = roles;
  }

  showTable() {
    this.refreshRoleList()
    console.table(this.roleList[0]);
    console.log("");
  }

  async addNewRole(depts) {
    let deptList = depts[0].map((dept) => dept.Department);

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

    const roleInfo = await prompt(roleQuestions);

    let roleDept = deptList.indexOf(roleInfo.newRoleDept) + 1; //Offsetting index by 1 since SQL indexes at 1

    return db
      .promise()
      .query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [roleInfo.newRoleTitle, parseInt(roleInfo.newRoleSalary), roleDept]
    );

  }
}

module.exports = Roles;
