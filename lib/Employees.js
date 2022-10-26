const { db, prompt } = require("../src/helperFunctions");

class Employees {
  constructor() {
    this.employeeList = null;
    this.refreshEmployeeList();    
  }

  getEmployeeList() {
    return this.employeeList
  }

  async refreshEmployeeList() {
    let employees = await db.promise().query(
      `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
                FROM employee copy1
                LEFT JOIN role ON copy1.role_id=role.id 
                LEFT JOIN department ON role.department_id=department.id
                LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id`
    );
    this.employeeList = employees;
  }

  showTable() {
    this.refreshEmployeeList();
    console.table(this.employeeList[0]);
    console.log("");
  }

  async addNewEmployee(roleList) {
    // Get potential roles for new employee
    let availableRoles = roleList[0];
    availableRoles = availableRoles.map(role => role.Title)
    // console.dir(availableRoles)

    // console.dir(this.employeeList)
    let employeeListNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    let employeeQuestions = [
      {
        type: "input",
        message: "New employee first name: ",
        name: "newEmpFirstName",
      },
      {
        type: "input",
        message: "New employee last name: ",
        name: "newEmpLastName",
      },
      {
        type: "list",
        message: "New employee role: ",
        choices: availableRoles,
        name: "newEmpRole",
      },
      {
        type: "list",
        message: `New employee's manager: `,
        choices: [...employeeListNames, "None"],
        name: "newEmpMan",
      },
    ];

    const empInfo = await prompt(employeeQuestions);
    let managerIndex = employeeListNames.indexOf(empInfo.newEmpMan) + 1;
    let roleIndex = availableRoles.indexOf(empInfo.newEmpRole) + 1;

    if (empInfo.newEmpMan !== "None") {
      return db
        .promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
          [
            empInfo.newEmpFirstName,
            empInfo.newEmpLastName,
            roleIndex,
            managerIndex,
          ]
        );
    } else {
      return db
        .promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`,
          [empInfo.newEmpFirstName, empInfo.newEmpLastName, roleIndex]
        );
    };
  };

  async changeEmployeeRole(rolesList) {
    // let availableRoles = rolesList[0];
    let roleTitles = rolesList[0].map((role) => role.Title);

    let employeeNames = this.employeeList[0].map(
      (emp) => `${emp['First Name']} ${emp['Last Name']}`
    );
    const empPicker = await prompt({
      type: "list",
      message: "Select employee to modify:",
      choices: employeeNames,
      name: "selectedEmployee",
    });
  
    const rolePicker = await prompt({
      type: "list",
      message: "Select employee new role: ",
      choices: roleTitles,
      name: "newRole",
    });
  
    let newRoleIndex = roleTitles.indexOf(rolePicker.newRole) + 1;
    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee) + 1;
  
    return db
    .promise()
    .query(`UPDATE employee SET role_id=? WHERE id=?`, [
      newRoleIndex,
      employeeIndex,
    ]);
  }
  
};

module.exports = Employees;
