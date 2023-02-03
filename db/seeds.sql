-- Seed data
INSERT INTO department (name)
VALUES ("Sales"),
       ("Food Service"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Book Seller", 25000.00, 1),
       ("Stocker", 28000.00, 1),
       ("General Manager", 40000.00, 1),
       ("Barista", 25000.00, 2),
       ("Baker", 32000.00, 2),
       ("Buyer", 50000.00, 3),
       ("Marketing Assistant", 45000.00, 3),
       ("Event Planner", 60000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Merlin", "Springtree", 3, NULL),
       ("Poppy", "Fields", 1, 1),
       ("Forest", "Everheart", 1, 1),
       ("Rose", "Briarwood", 2, 1),
       ("Honey", "Brew", 4, NULL),
       ("Henry", "Cakes", 5, NULL),
       ("Ivan", "Goldman", 6, NULL),
       ("Juniper", "Foxtrail", 7, 7),
       ("Celeste", "Cloudstar", 8, 7);