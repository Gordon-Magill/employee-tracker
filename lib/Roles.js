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

  // Update object with latest db content
  async refreshRoleList() {
    let roles = await db
      .promise()
      .query(
        "SELECT role.title AS 'Title', role.id AS 'Role ID', role.salary AS 'Salary', department.name AS 'Department' FROM role LEFT JOIN department ON role.department_id=department.id"
      );
    this.roleList = roles;
  }

  // Render formatted table
  showTable() {
    this.refreshRoleList();
    console.table(this.roleList[0]);
    console.log("");
  }

  // Inquirer prompt to define a new employee role type
  async addNewRole(depts) {
    // Get department names as potential homes for the role
    let deptList = depts[0].map((dept) => dept.Department);

    // Inquirer prompt questions to define the new role
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

    // Get the new role
    const roleInfo = await prompt(roleQuestions);

    // Deriving department ID based on response index
    let roleDept = deptList.indexOf(roleInfo.newRoleDept);
    let deptId = depts[0][roleDept]['Department ID']  

    // Writing new role to db
    return db
      .promise()
      .query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [roleInfo.newRoleTitle, parseInt(roleInfo.newRoleSalary), deptId]
      );
  }

  // Remove an existing role
  async removeRole() {
    // Get employee name strings
    let roleTitles = this.roleList[0].map(role => role.Title);

    // Inquirer question to get employee to change
    const rolePicker = await prompt({
      type: "list",
      message: "Select role to remove:",
      choices: roleTitles,
      name: "selectedRole",
    });

    // Get the role ID based on response index
    let roleIndex = roleTitles.indexOf(rolePicker.selectedRole);
    let roleID = this.roleList[0][roleIndex]['Role ID']

    // Actually delete the role
    return db
      .promise()
      .query(`DELETE FROM role WHERE id=?`, 
      roleID
      );


  }
}

module.exports = Roles;
