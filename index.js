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
    db.query('SELECT * FROM DEPARTMENTS', function (err, results)
    {
        console.log();
        var values = [];
        results.forEach(row =>
        {
            values.push({'id' : row.id, 'name' : row.name});
        });
        console.log('Departments:');
        console.table(values);
        mainMenu();
    });
}

function viewRoles()
{
    db.query('SELECT * FROM ROLES', function (err, results)
    {
        console.log();
        var values = [];
        results.forEach(row =>
        {
            var departmentName = 'null';

            db.query(`SELECT * FROM DEPARTMENTS WHERE id = ${row.department_id}`, function (err, results)
            {
                console.log(results[0].name);
                departmentName = results[0].name;
            });

            values.push({'id' : row.id,  'department' : departmentName, 'title' : row.title, 'salary' : row.salary});
        });
        console.log('Roles:');
        console.table(values);
        mainMenu();
    });
}

function viewEmployees()
{
    
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
                console.log('3');
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