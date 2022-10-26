USE company_db;

INSERT INTO department (name)
VALUES ('SeedDepartment1'),
('SeedDepartment2'),
('SeedDepartment3');

INSERT INTO role (title, salary, department_id)
VALUES ('SeedRole1', 150000.00, 1),
('SeedRole2', 100000.00,2),
('SeedRole3', 50000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('SeedFirstName1','SeedLastName1',1, NULL),
('SeedFirstName2','SeedLastName2',2,1),
('SeedFirstName3', 'SeedLastName3',3,2);