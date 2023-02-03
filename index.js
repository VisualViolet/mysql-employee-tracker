// Secure using dotenv
require("dotenv").config();

// Required Packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// Create connection to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the Employees database!`)
);

// Function to prompt menu options
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

// Function to view all departments.
function viewDepartments() {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      throw err;
    }
    // Console.table returns a formatted table result
    console.table(results);
    startPrompt();
  });
}

// Function to view all roles. Query includes a join to show department name instead of id.
function viewRoles() {
  db.query(
    "SELECT r.title AS jobTitle, r.id, d.name AS department, r.salary FROM role r INNER JOIN department d ON r.department_id = d.id;",
    (err, results) => {
      if (err) {
        throw err;
      }
      console.table(results);
      startPrompt();
    }
  );
}

// Function to view employees. Query includes two joins to show names for department and manager.
function viewEmployees() {
  db.query(
    'SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, r.title AS jobTitle, d.name AS department, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m  ON e.manager_id = m.id;',
    (err, results) => {
      if (err) {
        throw err;
      }
      console.table(results);
      startPrompt();
    }
  );
}

// Function to add a department
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

// Function to add a role. Queries were run before hand to create arrays for the inquirer choices so available options are always up to date
function addRole() {
    //querying this way will return an index value instead of a name from answers.department for easy insert into our SQL table
  db.query("SELECT id AS value, name FROM department", (err, results) => {
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
          // passing in results from above query (note: returns an object with value (key) and name (data))
          choices: results,
          name: "department",
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
          [answers.role, answers.salary, answers.department],
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

// Function to add an employee. Queries were run before hand to create arrays for the inquirer choices so available options are always up to date
function addEmployee() {
  db.query(
    // query uses a concat to return first and last name as a singular string
    'SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM EMPLOYEE',
    (err, empResults) => {
      if (err) throw err;

      db.query(
        "SELECT id AS value, title AS name FROM role",
        (err, roleResults) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                message: "What is this employees first name?",
                name: "firstName",
              },
              {
                type: "input",
                message: "What is this employees last name?",
                name: "lastName",
              },
              {
                type: "list",
                message: "What role does this employee have?",
                choices: roleResults,
                name: "role",
              },
              {
                type: "list",
                message: "Who manages this employee? (Can leave blank)",
                choices: empResults,
                name: "manager",
              },
            ])
            .then((answers) => {
              db.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
                [
                  answers.firstName,
                  answers.lastName,
                  answers.role,
                  answers.manager,
                ],
                (err, results) => {
                  if (err) {
                    throw err;
                  }
                  console.log(
                    `Added ${answers.firstName} ${answers.lastName} to employees!`
                  );
                  startPrompt();
                }
              );
            });
        }
      );
    }
  );
}

// Function to update role. Very similar syntax to the previous function except we're running an update query in our .then promise
function updateRole() {
  db.query(
    'SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM EMPLOYEE',
    (err, empResults) => {
      if (err) throw err;

      db.query(
        "SELECT id AS value, title AS name FROM role",
        (err, roleResults) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "list",
                message: "Which employee would you like to update?",
                choices: empResults,
                name: "employee",
              },
              {
                type: "list",
                message: "What's their role?",
                choices: roleResults,
                name: "role",
              },
            ])
            .then((answers) => {
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [answers.role, answers.employee],
                (err, results) => {
                  if (err) {
                    throw err;
                  }
                  console.log(
                    `Updated employee role!`
                  );
                  startPrompt();
                }
              );
            });
        }
      );
    }
  );
}

// Initialize app
startPrompt();
