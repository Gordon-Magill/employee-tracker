const inquirer = require('inquirer')

menuQuestions = [
    {
        type:'list',
        message: '',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add department',
            'Add role',
            'Add employee',
            'Change employee role'
        ],
        name: 'menuSelectedOption'
    },

];

deptQuestions = [
    {
        type: 'input',
        message: 'New dept name: ',
        name: 'newDeptName'
    },
]

employeeQuestions = [
    {
        type: 'input',
        message: 'New employee first name: ',
        name: 'newEmpFirstName'
    },
    {
        type: 'input',
        message: 'New employee last name: ',
        name: 'newEmpLastName'
    },
    {
        type: 'list',
        message: 'New employee role: ',
        choices: getRoles(),
        name: 'newEmpRole'
    },
    {
        type: 'list',
        message: `New employee's manager: `,
        choices: getEmployees(),
        name: 'newEmpMan'
    },
]

roleQuestions = [
    {
        type: 'input',
        message: 'New role title: ',
        name: 'newRoleTitle'
    },
    {
        type: 'input',
        message: 'New role salary: ',
        name: 'newRoleSalary'
    },
    {
        type: 'list',
        message: 'New role department: ',
        choices: getDepartments(),
        name: 'newRoleDept'
    },
]

function getRoles() {
    db.query('SELECT title FROM roles',(err, result) => {
        if (err) {
            console.log(err)
        } else {
            return result
        }
    })
}

async function getNewRole() {
    const roleInfo = await inquirer.prompt(roleQuestions);
    db.query('INSERT INTO roles VALUES (?, ?, ?)', [roleInfo.newRoleTitle, roleInfo.newRoleSalary, roleInfo.newRoleDept], (err, result) => {

    })
}

module.exports = {
    getRoles,

}