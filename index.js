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
    }
);

//validator for if an entry was left blank
const isAnswerBlank = async (input) =>
{
    if (input == '') return 'This field is required';
    else return true;
}

//function to view all departments
function viewDepartments()
{
    console.log();

    //query to get and sort all department information
    db.query(`SELECT ID, DEPARTMENT_NAME
    FROM DEPARTMENTS
    ORDER BY ID;`, function (err, results)
    {
        console.log();
        console.log('Departments');
        console.table(results);
        mainMenu();
    });
}

//function to view all roles
function viewRoles()
{
    //query to get, format, and sort all role information
    db.query(`SELECT ROLES.ID, ROLES.ROLE_NAME, ROLES.SALARY, DEPARTMENTS.DEPARTMENT_NAME
    FROM ROLES
    JOIN DEPARTMENTS ON DEPARTMENTS.ID = ROLES.DEPARTMENT_ID
    ORDER BY ROLES.ID;`, function (err, results)
    {
        console.log();
        console.log('Roles:');
        console.table(results);
        mainMenu();
    });
}

//function to view all employees
function viewEmployees()
{
    //query to get, format, and sort all employee information
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

//function to add a new department
function addDepartment()
{
    //input to take in the new department information
    inquirer.prompt(
    [{
        type: 'input',
        name: 'department_name',
        message: 'What is the name of the new department?',
        validate: isAnswerBlank,
    }]).then((answers) =>
    {
        //query to add new department information
        db.query(`INSERT INTO DEPARTMENTS (DEPARTMENT_NAME)
        VALUES ("${answers.department_name}");`, function (err, results)
        {
            console.log();
            console.log(`Added ${answers.department_name} to the departments table`)
            mainMenu();
        });
    });
}

//function to add a new role
function addRole()
{
    var deps = [];
    var depnames = [];

    //get departments
    db.query('SELECT ID, DEPARTMENT_NAME FROM DEPARTMENTS;', function (err, results)
    {
        console.log();
        results.forEach(element =>
        {
            deps.push(element);
            depnames.push(element.DEPARTMENT_NAME);
        });

        //input to take in the new role information
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
            type: 'list',
            name: 'department_name',
            message: 'What is the department for this new role?',
            choices: depnames,
        }]).then((answers) =>
        {
            let depid = deps.find(dep => dep.DEPARTMENT_NAME == answers.department_name).ID;

            //query to insert new role information
            db.query(`INSERT INTO ROLES (ROLE_NAME, SALARY, DEPARTMENT_ID)
            VALUES ("${answers.role_name}", ${answers.salary}, ${depid});`, function (err, results)
            {
                console.log();
                console.log(`Added ${answers.role_name} to the roles table with a salary of ${answers.salary} and department of ${answers.department_name}.`)
                mainMenu();
            });
        });
    });
}

//function to add a new employee
function addEmployee()
{
    var roles = [];
    var rolenames = [];
    var mngrs = [];
    var mngrnames = [];

    //get roles
    db.query('SELECT ID, ROLE_NAME FROM ROLES;', function (err, results)
    {
        results.forEach(element =>
        {
            roles.push(element);
            rolenames.push(element.ROLE_NAME);
        });

        //get managers
        db.query('SELECT ID, FIRST_NAME, LAST_NAME FROM EMPLOYEES WHERE MANAGER_ID IS NULL;', function (err, results)
        {
            results.forEach(element =>
            {
                mngrs.push(element);
                mngrnames.push(`${element.FIRST_NAME} ${element.LAST_NAME}`);
            });

            //input to take in the new employee's information
            inquirer.prompt(
            [{
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the new employee?',
                validate: isAnswerBlank,
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the new employee?',
                validate: isAnswerBlank,
            },
            {
                type: 'list',
                name: 'role_name',
                message: 'What is the role ID for this new employee?',
                choices: rolenames,
                validate: isAnswerBlank,
            },
            {
                type: 'list',
                name: 'manager_name',
                message: 'Who is this new employee\`s manager? Leave blank if they are a manager.',
                choices: mngrnames,
            }]).then((answers) =>
            {
                let roleid = roles.find(role => role.ROLE_NAME == answers.role_name).ID;
                let mngrid = mngrs.filter(mngr => [mngr.FIRST_NAME, mngr.LAST_NAME].join(' ') == answers.manager_name)[0].ID;
        
                //query to add new employee information
                db.query(`INSERT INTO EMPLOYEES (FIRST_NAME, LAST_NAME, ROLE_ID, MANAGER_ID)
                VALUES ("${answers.first_name}", "${answers.last_name}", ${roleid}, ${mngrid || "null"});`, function (err, results)
                {
                    console.log();
                    console.log(`Added ${answers.first_name} ${answers.last_name} to the employees table with the role ${answers.role_name} and manager ${answers.manager_name}.`)
                    mainMenu();
                });
            });
        });
    });
}

//function to update an employee's role
function updateRole()
{
    var emps = [];
    var empnames = [];
    var roles = [];
    var rolenames = [];

    //get employees
    db.query('SELECT ID, FIRST_NAME, LAST_NAME FROM EMPLOYEES;', function (err, results)
    {
        results.forEach(element =>
        {
            emps.push(element);
            empnames.push(`${element.FIRST_NAME} ${element.LAST_NAME}`);
        });

        //get roles
        db.query('SELECT ID, ROLE_NAME FROM ROLES;', function (err, results)
        {
            results.forEach(element =>
            {
                roles.push(element);
                rolenames.push(element.ROLE_NAME);
            });

            //input to take in an employee's new role
            inquirer.prompt(
            [{
                type: 'list',
                name: 'employee_name',
                message: 'Select an employee to update:',
                choices: empnames,
            },
            {
                type: 'list',
                name: 'role_name',
                message: 'Select the new role for this employee:',
                choices: rolenames,
            }]).then((answers) =>
            {
                let empid = emps.filter(emp => [emp.FIRST_NAME, emp.LAST_NAME].join(' ') == answers.employee_name)[0].ID;
                let roleid = roles.find(role => role.ROLE_NAME == answers.role_name).ID;
        
                //query to update employee's role
                db.query(`UPDATE (EMPLOYEES)
                SET ROLE_ID = ${roleid} WHERE ID = ${empid};`, function (err, results)
                {
                    console.log();
                    console.log(`Updated ${answers.employee_name} to role ${answers.role_name}`)
                    mainMenu();
                });
            });
        });
    });
}

//the main input loop
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
                    'Exit'
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
            case 'Exit':
                console.log('Goodbye.');
                db.end();
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