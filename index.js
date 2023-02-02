// Required Packages
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the Employees database!`)
);

const startPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Hello! What would you like to do today?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee Role",
          "I'm done!",
        ],
        name: "choice",
      },
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
          console.log("Thank you! See you next time.");
      }
    });
};

function viewDepartments() {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      throw err;
    }
    console.table(results);
    startPrompt();
  });
}

function viewRoles() {
  db.query("SELECT * FROM role", (err, results) => {
    if (err) {
      throw err;
    }
    console.table(results);
    startPrompt();
  });
}

function viewEmployees() {
  db.query("SELECT * FROM employee", (err, results) => {
    if (err) {
      throw err;
    }
    console.table(results);
    startPrompt();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "department",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.department],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log(`Added ${answer.department} to departments!`);
          startPrompt();
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      throw err;
    }

    inquirer
      .prompt([
        {
          type: "input",
          message: "What role would you like to add?",
          name: "role",
        },
        {
          type: "input",
          message: "Enter the salary for this role (ex: 25000.00):",
          name: "salary",
        },
        {
          type: "list",
          message: "What department does this role belong to?",
          choices: results,
          name: "department",
        },
      ])
      .then((answers) => {
        let departmentID;
        results.forEach((department) => {
          if (department.name === answers.department) {
            departmentID = department.id;
          }
          console.log(departmentID);
        });
        db.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
          [answers.role, answers.salary, departmentID],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(`Added ${answers.role} to roles!`);
            startPrompt();
          }
        );
      });
  });
}

startPrompt();
