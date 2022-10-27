const { db, prompt } = require("../src/helperFunctions");

// Class to model db content about employees
class Employees {
  constructor() {
    this.employeeList = null;
    this.refreshEmployeeList();
  }

  // Basic property getter
  getEmployeeList() {
    return this.employeeList;
  }

  // Updates obj data with db content
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

  // Display formatted table to the user
  showTable() {
    this.refreshEmployeeList();
    console.table(this.employeeList[0]);
    console.log("");
  }

  // Adds a new user to the db
  async addNewEmployee(roleList) {
    // Get potential roles for new employee
    let availableRoles = roleList[0];
    availableRoles = availableRoles.map((role) => role.Title);

    // Format employee names for inquirer prompt
    let employeeListNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    // Inquirer questions
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

    // Ask the user for employee info
    const empInfo = await prompt(employeeQuestions);

    // Derive db table indices from responses
    let managerIndex = employeeListNames.indexOf(empInfo.newEmpMan) + 1;
    let roleIndex = availableRoles.indexOf(empInfo.newEmpRole) + 1;

    // Set new employee based on if manager was defined or not
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
    }
  }

  async changeEmployeeRole(rolesList) {
    // Get available role titles for inquirer
    let roleTitles = rolesList[0].map((role) => role.Title);

    // Get employee name strings
    let employeeNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    // Inquirer question to get employee to change
    const empPicker = await prompt({
      type: "list",
      message: "Select employee to modify:",
      choices: employeeNames,
      name: "selectedEmployee",
    });

    // Inquirer question to select a new role
    const rolePicker = await prompt({
      type: "list",
      message: "Select employee new role: ",
      choices: roleTitles,
      name: "newRole",
    });

    // Deriving db table indices from responses
    let newRoleIndex = roleTitles.indexOf(rolePicker.newRole) + 1;
    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee) + 1;

    // Write new employee info to db
    return db
      .promise()
      .query(`UPDATE employee SET role_id=? WHERE id=?`, [
        newRoleIndex,
        employeeIndex,
      ]);
  }

  async changeEmployeeManager() {
    // Get employee name strings
    let employeeNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    // Inquirer question to get employee to change
    const empPicker = await prompt({
      type: "list",
      message: "Select employee to modify:",
      choices: employeeNames,
      name: "selectedEmployee",
    });

    // Inquirer question to select a new manager
    const managerPicker = await prompt({
      type: "list",
      message: "Select employee's new manager: ",
      choices: [...employeeNames, 'None'],
      name: "newManager",
    });

    // Deriving db table indices from responses
    let newManagerIndex = employeeNames.indexOf(managerPicker.newManager) + 1;
    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee) + 1;

    // Write new employee info to db
    if (managerPicker.newManager === 'None') {
      return db
      .promise()
      .query(`UPDATE employee SET manager_id=null WHERE id=?`, 
        employeeIndex
      );
    } else {
      return db
      .promise()
      .query(`UPDATE employee SET manager_id=? WHERE id=?`, [
        newManagerIndex,
        employeeIndex,
      ]);
    }
  };

  async removeEmployee() {
    // Get employee name strings
    let employeeNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    // Inquirer question to get employee to change
    const empPicker = await prompt({
      type: "list",
      message: "Select employee to remove:",
      choices: employeeNames,
      name: "selectedEmployee",
    });

    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee) + 1;

    return db
      .promise()
      .query(`DELETE FROM employee WHERE id=?`, 
        employeeIndex
      );

  };

  async viewEmployeesByManager() {
    let employeeNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    // Inquirer question to get employee to change
    const empPicker = await prompt({
      type: "list",
      message: "Select manager to get direct reports from:",
      choices: employeeNames,
      name: "selectedEmployee",
    });

    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee) + 1;
    
    let managedEmployees = await db.promise().query(
      `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
                FROM employee copy1
                LEFT JOIN role ON copy1.role_id=role.id 
                LEFT JOIN department ON role.department_id=department.id
                LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id
                WHERE copy1.manager_id=?`,
                employeeIndex
    );

    console.log(`Employees reporting to ${empPicker.selectedEmployee}:`)
    console.table(managedEmployees[0]);
    console.log("");
  };
  
  async viewEmployeesByDepartment(depts) {
    console.dir(depts)
    let deptNames = depts[0].map(dept => dept.Department);

    // Inquirer question to get employee to change
    const deptPicker = await prompt({
      type: "list",
      message: "Select department to get employees from:",
      choices: deptNames,
      name: "selectedDept",
    });

    // let deptIndex = deptNames.indexOf(deptPicker.selectedDept) + 1;
    
    let deptEmployees = await db.promise().query(
      `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
                FROM employee copy1
                LEFT JOIN role ON copy1.role_id=role.id 
                LEFT JOIN department ON role.department_id=department.id
                LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id
                WHERE department.name=?`,
                deptPicker.selectedDept
    );

    console.log(`Employees in department ${deptPicker.selectedDept}:`)
    console.table(deptEmployees[0]);
    console.log("");
  }
}

module.exports = Employees;
