const inquirer = require("inquirer");

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
    choices: getRoles(),
    name: "newEmpRole",
  },
  {
    type: "list",
    message: `New employee's manager: `,
    choices: getEmployees(),
    name: "newEmpMan",
  },
];

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
    choices: getDepartments(),
    name: "newRoleDept",
  },
];

async function getMenuOption() {
    const selectedOption = await inquirer.prompt(menuQuestions)
    return selectedOption.menuSelectedOption;
}

function getRoles() {
  db.query("SELECT title FROM roles", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return result;
    }
  });
}

async function setNewRole() {
  const roleInfo = await inquirer.prompt(roleQuestions);
  db.query(
    "INSERT INTO roles VALUES (?, ?, ?)",
    [roleInfo.newRoleTitle, roleInfo.newRoleSalary, roleInfo.newRoleDept],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log({
          result,
          msg: "Successfully wrote new role to db",
        });
      }
    }
  );
}

function getDepts() {
  db.query("SELECT deptName FROM departments", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return result;
    }
  });
}

async function setNewDept() {
  const deptInfo = await inquirer.prompt(deptQuestions);
  db.query(
    "INSERT INTO departments VALUES (?)",
    deptInfo.newDeptName,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log({
          result,
          msg: "Successfully wrote new dept to db",
        });
      }
    }
  );
}

function getEmployees() {
  db.query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.deptName 
        FROM employees  
        LEFT JOIN roles ON employees.role_id=roles.id 
        LEFT JOIN departments ON roles.department_id=departments.id`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        return result;
      }
    }
  );
}

async function setNewEmployee() {
  const empInfo = await inquirer.prompt(employeeQuestions);
  db.query(
    `INSERT INTO employees VALUES (?,?,?,?)`,
    [
      empInfo.newEmpFirstName,
      empInfo.newEmpLastName,
      empInfo.newEmpRole,
      empInfo.newEmpMan,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log({
          result,
          msg: "Successfully wrote new employee to db",
        });
      }
    }
  );
};

async function changeEmployee() {
  
}

module.exports = {
  getRoles,
  setNewRole,
  getDepts,
  setNewDept,
  getEmployees,
  setNewEmployee,
  getMenuOption
};
