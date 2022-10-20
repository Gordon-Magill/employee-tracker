USE company_db;

INSERT INTO department (name)
VALUES ('Cell Culture'),
('Purification'),
('ADQC');

INSERT INTO role (title, salary, department_id)
VALUES ('Principal Engineer', 150000.00, 1),
('Senior Engineer', 100000.00, 2),
('Research associate', 80000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('mr firstname','lastname',1, NULL),
('intern firstname','intern lastname',3,1),
('engineer firstname', 'engineer lastname',2,1);