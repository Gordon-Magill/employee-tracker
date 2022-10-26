const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
});

let prompt = inquirer.createPromptModule();

async function getDepts() {
  return db.promise().query("SELECT deptName FROM departments");
}

function showDepts(depts) {
  console.log("\nDepartments:");
  depts.forEach((dept) => {
    console.log(`\t-${dept.deptName}`);
  });
  console.log("");
}

async function getRoles() {
  return db.promise().query("SELECT title FROM roles");
}

function showRoles(roles) {
  console.log("\nRoles:");
  roles.forEach((role) => {
    // console.table(role)
    console.log(`\t-${role.title}`);
  });
  console.log("");
}

async function getEmployees() {
  return db.promise().query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.deptName 
        FROM employees  
        LEFT JOIN roles ON employees.role_id=roles.id 
        LEFT JOIN departments ON roles.department_id=departments.id`
  );
}

function showEmployees(employees) {
  console.log("\nEmployees:");
  employees.forEach((emp) => {
    console.log(` -${emp.first_name} ${emp.last_name}
    ID: ${emp.id}
    Department: ${emp.deptName}
    Title: ${emp.title}
    Salary: $${emp.salary}/yr\n`);
  });
  console.log("");
}

menuQuestions = [
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
    name: "menuSelectedOption",
  },
];

deptQuestions = [
  {
    type: "input",
    message: "New dept name: ",
    name: "newDeptName",
  },
];

async function getMenuOption() {
  const selectedOption = await prompt(menuQuestions);
  return selectedOption.menuSelectedOption;
}

async function addNewRole() {
  let deptList = await getDepts();
  deptList = deptList[0].map((dept) => dept.deptName);
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
      "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
      [roleInfo.newRoleTitle, parseInt(roleInfo.newRoleSalary), roleDept]
    );
}

async function addNewDept() {
  const deptInfo = await prompt(deptQuestions);

  return db
    .promise()
    .query(
      "INSERT INTO departments (deptName) VALUES (?);",
      deptInfo.newDeptName
    );
}

async function addNewEmployee() {
  let roleList = await getRoles();
  roleList = roleList[0].map((role) => role.title);
  // let deptList = await getDepts();
  // deptList = deptList[0]
  let employeeList = await getEmployees();
  employeeList = employeeList[0].map(
    (emp) => `${emp.first_name} ${emp.last_name}`
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
      choices: employeeList,
      name: "newEmpMan",
    },
  ];

  const empInfo = await prompt(employeeQuestions);
  let managerIndex = employeeList.indexOf(empInfo.newEmpMan) + 1;
  let roleIndex = roleList.indexOf(empInfo.newEmpRole) + 1;

  return db
    .promise()
    .query(
      `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [empInfo.newEmpFirstName, empInfo.newEmpLastName, roleIndex, managerIndex]
    );
}

async function changeEmployeeRole() {
  let roleList = await getRoles();
  roleList = roleList[0].map((role) => role.title);
  let employeeList = await getEmployees();
  employeeList = employeeList[0].map(
    (emp) => `${emp.first_name} ${emp.last_name}`
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

  // const valuePicker = await prompt({
  //   type: "input",
  //   message: `Select value for ${attrPicker.selectedAttr} on ${empPicker.selectedEmployee}:`,
  //   name: "attrValue",
  // });

  let newRoleIndex = roleList.indexOf(rolePicker.newRole) + 1;
  let employeeIndex = employeeList.indexOf(empPicker.selectedEmployee) + 1;

  return db
    .promise()
    .query(`UPDATE employees SET role_id=? WHERE id=?`, [
      newRoleIndex,
      employeeIndex,
    ]);
}

function closeDB() {
  console.log("Closing db connection...");
  db.end();
  console.log("db connection closed.");
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
  closeDB,
};
