const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
});

// Creating an independent prompt module (future proofing)
let prompt = inquirer.createPromptModule();

// Function to alert the user that the database connection is closing
function closeDB() {
  console.log("\nClosing db connection...");
  db.end();
  console.log("db connection closed.");
}

// Displays the main menu options that make high level functions available
async function getMenuOption() {
  let menuQuestions = [
    {
      type: "list",
      message: "",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add department",
        "Add role",
        "Add employee",
        "Change employee role",
        "Quit",
      ],
      name: "Options",
    },
  ];

  const selectedOption = await prompt(menuQuestions);
  return selectedOption.Options;
};

// ***************************
// FUNCTIONS ABOUT DEPARTMENTS
// ***************************

// Retrieve a promise resolving to an array of department table row objects
async function getDepts() {
  let depts = await db.promise().query("SELECT name AS 'Department', id AS 'Department ID' FROM department;");
  return depts
};

// 
function showDepts(depts) {
  console.table(depts)
  console.log("");
}

deptQuestions = [
  {
    type: "input",
    message: "New dept name: ",
    name: "newDeptName",
  },
];

async function addNewDept() {
  const deptInfo = await prompt(deptQuestions);

  return db
    .promise()
    .query(
      "INSERT INTO department (name) VALUES (?);",
      deptInfo.newDeptName
    );
}

// *********************
// FUNCTIONS ABOUT ROLES
// *********************

async function getRoles() {
  return db.promise().query("SELECT role.title AS 'Title', role.id AS 'Role ID', role.salary AS 'Salary', department.name AS 'Department' FROM role LEFT JOIN department ON role.department_id=department.id");

      // `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.deptName 
      //     FROM employees  
      //     LEFT JOIN roles ON employees.role_id=roles.id 
      //     LEFT JOIN departments ON roles.department_id=departments.id`

}

function showRoles(roles) {
  console.table(roles)
  console.log("");
}

async function addNewRole() {
  let deptList = await getDepts();
  // console.dir(deptList)
  deptList = deptList[0].map((dept) => dept.Department);
  // console.dir(deptList)

  roleQuestions = [
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
};

// *************************
// FUNCTIONS ABOUT EMPLOYEES
// *************************

async function getEmployees() {
  return db.promise().query(
    `SELECT copy1.id AS 'Employee ID', copy1.first_name AS 'First Name', copy1.last_name AS 'Last Name', role.title AS ' Title', role.salary AS 'Salary', department.name AS 'Department', copy2.first_name AS 'Manager First Name', copy2.last_name as 'Manager Last Name'
        FROM employee copy1
        LEFT JOIN role ON copy1.role_id=role.id 
        LEFT JOIN department ON role.department_id=department.id
        LEFT JOIN employee copy2 ON copy1.manager_id=copy2.id`
  );
}

function showEmployees(employees) {
  console.table(employees)
  console.log("");
}

async function addNewEmployee() {
  // Get potential roles for new employee
  let roleList = await getRoles();
  roleList = roleList[0].map((role) => role.Title);

  // Get potential managers for new employee
  let employeeList = await getEmployees();
  employeeList = employeeList[0].map(
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
      choices: [...employeeList, 'None'],
      name: "newEmpMan",
    },
  ];

  const empInfo = await prompt(employeeQuestions);
  let managerIndex = employeeList.indexOf(empInfo.newEmpMan) + 1;
  let roleIndex = roleList.indexOf(empInfo.newEmpRole) + 1;

  if (empInfo.newEmpMan !== 'None') {
    return db
    .promise()
    .query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [empInfo.newEmpFirstName, empInfo.newEmpLastName, roleIndex, managerIndex]
    );
  } else {
    return db
    .promise()
    .query(
      `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`,
      [empInfo.newEmpFirstName, empInfo.newEmpLastName, roleIndex]
    );

  }
  
};

async function changeEmployeeRole() {
  let roleList = await getRoles();
  roleList = roleList[0].map((role) => role.Title);
  let employeeList = await getEmployees();
  employeeList = employeeList[0].map(
    (emp) => `${emp['First Name']} ${emp['Last Name']}`
  );
  const empPicker = await prompt({
    type: "list",
    message: "Select employee to modify:",
    choices: employeeList,
    name: "selectedEmployee",
  });

  const rolePicker = await prompt({
    type: "list",
    message: "Select employee new role: ",
    choices: roleList,
    name: "newRole",
  });

  let newRoleIndex = roleList.indexOf(rolePicker.newRole) + 1;
  let employeeIndex = employeeList.indexOf(empPicker.selectedEmployee) + 1;

  return db
    .promise()
    .query(`UPDATE employee SET role_id=? WHERE id=?`, [
      newRoleIndex,
      employeeIndex,
    ]);
}

module.exports = {
  getRoles,
  addNewRole,
  showRoles,
  getDepts,
  showDepts,
  addNewDept,
  getEmployees,
  showEmployees,
  addNewEmployee,
  getMenuOption,
  changeEmployeeRole,
  db,
  prompt,
  closeDB,
};
