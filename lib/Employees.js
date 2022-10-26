const inquirer = require("inquirer");
const mysql = require("mysql2");

const { db,prompt } = require("../src/helperFunctions");

class Employees {
  constructor() {
    this.employeeList = null;
    refreshEmployeeList()
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

  showTable(employees) {
    console.table(employees)
    console.log("");
  };

  async addNewEmployee(rolesObj) {
    // Get potential roles for new employee
    let roleList = await rolesObj.roleList;
  
    let employeeListNames = this.employeeList.map(
      (emp) => `${emp['First Name']} ${emp['Last Name']}`
    );
  
    employeeQuestions = [
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
        choices: roleList,
        name: "newEmpRole",
      },
      {
        type: "list",
        message: `New employee's manager: `,
        choices: [...employeeListNames, 'None'],
        name: "newEmpMan",
      },
    ];
  
    const empInfo = await prompt(employeeQuestions);
    let managerIndex = employeeList.indexOf(empInfo.newEmpMan) + 1;
    let roleIndex = roleList.indexOf(empInfo.newEmpRole) + 1;
  
    let insertPromise = null;
    if (empInfo.newEmpMan !== 'None') {
        insertPromise = await db.promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
          [empInfo.newEmpFirstName, empInfo.newEmpLastName, roleIndex, managerIndex]
        );
    } else {
        insertPromise = await db.promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`,
          [empInfo.newEmpFirstName, empInfo.newEmpLastName, roleIndex]
        );
    }
    return insertPromise;
    
  };
  

}

module.exports = Employees;