const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log('connected')
);

//validator for if an entry was left blank
const isAnswerBlank = async (input) =>
{
    if (input == '') return 'This field is required';
    else return true;
}

function viewDepartments()
{
    console.log();
    db.query('SELECT ID, DEPARTMENT_NAME FROM DEPARTMENTS;', function (err, results)
    {
        console.log();
        console.log('Departments');
        console.table(results);
        mainMenu();
    });
}

function viewRoles()
{
    console.log();
    db.query('SELECT ROLES.ID, ROLES.ROLE_NAME, ROLES.SALARY, DEPARTMENTS.DEPARTMENT_NAME FROM ROLES JOIN DEPARTMENTS ON DEPARTMENTS.ID = ROLES.DEPARTMENT_ID;', function (err, results)
    {
        console.log();
        console.log('Roles:');
        console.table(results);
        mainMenu();
    });
}

function viewEmployees()
{
    console.log();
    db.query(`SELECT EMPLOYEES.ID, EMPLOYEES.FIRST_NAME, EMPLOYEES.LAST_NAME, ROLES.ROLE_NAME, DEPARTMENTS.DEPARTMENT_NAME, ROLES.SALARY, CONCAT(MANAGER.FIRST_NAME, ' ', MANAGER.LAST_NAME) AS MANAGER
    FROM EMPLOYEES
    JOIN ROLES ON ROLES.ID = EMPLOYEES.ROLE_ID
    JOIN DEPARTMENTS ON DEPARTMENTS.ID = ROLES.DEPARTMENT_ID
    LEFT JOIN EMPLOYEES AS MANAGER ON MANAGER.ID = EMPLOYEES.MANAGER_ID
    ORDER BY EMPLOYEES.ID;`, function (err, results)
    {
        console.log();
        console.log('Employees:');
        console.table(results);
        mainMenu();
    });
}

function addDepartment()
{
    inquirer.prompt(
    [{
        type: 'input',
        name: 'department_name',
        message: 'What is the name of the new department?',
        validate: isAnswerBlank,
    }]).then((answers) =>
    {
        db.query(`INSERT INTO DEPARTMENTS (DEPARTMENT_NAME)
        VALUES ("${answers.department_name}");`, function (err, results)
        {
            console.log(`Added ${answers.department_name} to the departments table`)
            mainMenu();
        });
    });
}

function addRole()
{
    inquirer.prompt(
    [{
        type: 'input',
        name: 'role_name',
        message: 'What is the name of the new role?',
        validate: isAnswerBlank,
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary amount for this new role?',
        validate: isAnswerBlank,
    },
    {
        type: 'input',
        name: 'department_id',
        message: 'What is the department ID for this new role?',
        validate: isAnswerBlank,
    }]).then((answers) =>
    {
        db.query(`INSERT INTO ROLES (ROLE_NAME, SALARY, DEPARTMENT_ID)
        VALUES ("${answers.role_name}", ${answers.salary}, ${answers.department_id});`, function (err, results)
        {
            console.log(`Added ${answers.role_name} to the roles table with a salary of ${answers.salary} and department ID of ${answers.department_id}`)
            mainMenu();
        });
    });
}

function addEmployee()
{
    console.log('addEmployee()');
    mainMenu();
}

function updateRole()
{
    console.log('updateRole()');
    mainMenu();
}

function mainMenu()
{
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'menuChoice',
                message: 'Main Menu',
                choices:
                [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                ],
            }
        ]
    ).then((response) =>
    {
        switch (response.menuChoice)
        {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateRole();
                break;
            default:
                console.log('error with response ' + response.menuChoice);
        }
    })
}

//an introduction to the script that confirms user intent before capturing CLI focus
console.log('Welcome to the employee tracker script. This tool will store and display employee information.');
inquirer.prompt(
    [
        {
            type: 'confirm',
            name: 'begin',
            message: 'Would you like to begin?',
        }
    ]).then((response) =>
    {
        if (response.begin) return mainMenu();
        else 
        {
            console.log('Goodbye.');
            db.end();
        }
    }
);