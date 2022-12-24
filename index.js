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
    db.query('SELECT ID, DEPARTMENT_NAME FROM DEPARTMENTS', function (err, results)
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
    db.query('SELECT ROLES.ID, ROLES.ROLE_NAME, ROLES.SALARY, DEPARTMENTS.DEPARTMENT_NAME FROM ROLES JOIN DEPARTMENTS ON DEPARTMENTS.ID = ROLES.DEPARTMENT_ID', function (err, results)
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
    ORDER BY EMPLOYEES.ID`, function (err, results)
    {
        console.log();
        console.log('Employees:');
        console.table(results);
        mainMenu();
    });
}

function addDepartment()
{

}

function addRole()
{

}

function addEmployee()
{

}

function updateRole()
{

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
                console.log('4');
                break;
            case 'Add a role':
                console.log('5');
                break;
            case 'Add an employee':
                console.log('6');
                break;
            case 'Update an employee role':
                console.log('7');
                break;
            default:
                console.log('error with response ' + response.menuChoice);
        }

        mainMenu();
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