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

  // Updates obj data with latestdb content
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

  // Display formatted table of employees
  showTable() {
    this.refreshEmployeeList();
    console.table(this.employeeList[0]);
    console.log("");
  }

  // Handles db queries to add a new employee
  async addNewEmployee(roleList) {
    // Get potential roles for new employee and format them to get just the titles for the prompt
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
        choices: [...employeeListNames, "None"], //Include a 'none' option - someone has to be the boss
        name: "newEmpMan",
      },
    ];

    // Ask the user for employee info
    const empInfo = await prompt(employeeQuestions);

    // Derive db table ID's from response indices
    let managerIndex = employeeListNames.indexOf(empInfo.newEmpMan);
    let managerID = this.employeeList[0][managerIndex]['Employee ID'];
    let roleIndex = availableRoles.indexOf(empInfo.newEmpRole);
    let roleID = roleList[0][roleIndex]['Role ID']

    // Set new employee query based on if manager was defined or not
    if (empInfo.newEmpMan !== "None") {
      return db
        .promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
          [
            empInfo.newEmpFirstName,
            empInfo.newEmpLastName,
            roleID,
            managerID,
          ]
        );
    } else {
      return db
        .promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`,
          [empInfo.newEmpFirstName, empInfo.newEmpLastName, roleID]
        );
    }
  }

  // Alters an existing employee's role
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

    // Deriving db table ID from response indices
    let newRoleIndex = roleTitles.indexOf(rolePicker.newRole);
    let newRoleID = rolesList[0][newRoleIndex]['Role ID']
    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee);
    let employeeID = this.employeeList[0][employeeIndex]['Employee ID']

    // Write new employee info to db
    return db
      .promise()
      .query(`UPDATE employee SET role_id=? WHERE id=?`, [
        newRoleID,
        employeeID,
      ]);
  }

  // Change an existing employee's manager
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

    // Deriving db table IDs from response indices
    let newManagerIndex = employeeNames.indexOf(managerPicker.newManager);
    let newManagerID = this.employeeList[0][newManagerIndex]['Employee ID']
    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee);
    let employeeID = this.employeeList[0][employeeIndex]['Employee ID']

    // Write new employee info to db based on if a manager was selected
    if (managerPicker.newManager === 'None') {
      return db
      .promise()
      .query(`UPDATE employee SET manager_id=null WHERE id=?`, 
      employeeID
      );
    } else {
      return db
      .promise()
      .query(`UPDATE employee SET manager_id=? WHERE id=?`, [
        newManagerID,
        employeeID,
      ]);
    }
  };

  // Remove and existing employee
  async removeEmployee() {
    // Get employee name strings
    let employeeNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    // Inquirer question to get employee to remove
    const empPicker = await prompt({
      type: "list",
      message: "Select employee to remove:",
      choices: employeeNames,
      name: "selectedEmployee",
    });

    // Get employee ID based on response index
    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee);
    let employeeID = this.employeeList[0][employeeIndex]['Employee ID']

    // Actually delete the selected employee
    return db
      .promise()
      .query(`DELETE FROM employee WHERE id=?`, 
      employeeID
      );

  };

  // Logs a subset of users based on a defined common manager
  async viewEmployeesByManager() {
    // Get list of employees (who could be managers)
    let employeeNames = this.employeeList[0].map(
      (emp) => `${emp["First Name"]} ${emp["Last Name"]}`
    );

    // Inquirer question to get the manager that will have their employees viewed
    const empPicker = await prompt({
      type: "list",
      message: "Select manager to get direct reports from:",
      choices: employeeNames,
      name: "selectedEmployee",
    });

    // Get the manager's ID based on the response index
    let employeeIndex = employeeNames.indexOf(empPicker.selectedEmployee);
    let employeeID = this.employeeList[0][employeeIndex]['Employee ID']
    
    // Get all employees with the defined manager
    let managedEmployees = await db.promise().query(
      `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
                FROM employee copy1
                LEFT JOIN role ON copy1.role_id=role.id 
                LEFT JOIN department ON role.department_id=department.id
                LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id
                WHERE copy1.manager_id=?`,
                employeeID
    );

    // Log the relevant information
    console.log(`Employees reporting to ${empPicker.selectedEmployee}:`)
    console.table(managedEmployees[0]);
    console.log("");
  };
  
  // View a subset of employees based on a common department
  async viewEmployeesByDepartment(depts) {
    // Get list of potential departments
    let deptNames = depts[0].map(dept => dept.Department);

    // Inquirer question to select the department
    const deptPicker = await prompt({
      type: "list",
      message: "Select department to get employees from:",
      choices: deptNames,
      name: "selectedDept",
    });
    
    // Get employees that belong to the selected department
    let deptEmployees = await db.promise().query(
      `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
                FROM employee copy1
                LEFT JOIN role ON copy1.role_id=role.id 
                LEFT JOIN department ON role.department_id=department.id
                LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id
                WHERE department.name=?`,
                deptPicker.selectedDept
    );

    // Log the employee subset for viewing
    console.log(`Employees in department ${deptPicker.selectedDept}:`)
    console.table(deptEmployees[0]);
    console.log("");
  }
}

module.exports = Employees;
