// Required Packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const sqlQueries = require('./utils/sqlQueries');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employees_db'
    },
    console.log(`Connected to the Employees database!`)
  );

const startPrompt = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Hello! What would you like to do today?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role", "I'm done!"],
            name: "choice"
        }
    ])
    .then((answer) => {
        switch (answer.choice) {
            case "View All Departments":
                viewDepartments();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "View All Employees":
                viewEmployees();
                break;
            case "Add A Department":
                addDepartment();
                break;
            case "Add A Role":
                addRole();
                break;
            case "Add An Employee":
                addEmployee();
                break;
            case "Update An Employee Role":
                updateRole();
                break;
            case "I'm done!":
                console.log("Thank you! See you next time.")
        }
    })
}

function viewDepartments() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err)
        {
            throw err;
        }
        console.table(results);
        startPrompt();
    })
}

function viewRoles() {
    db.query('SELECT * FROM role', (err, results) => {
        if (err)
        {
            throw err;
        }
        console.table(results);
        startPrompt();
    })
}

function viewEmployees() {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err)
        {
            throw err;
        }
        console.table(results);
        startPrompt();
    })
}

startPrompt();